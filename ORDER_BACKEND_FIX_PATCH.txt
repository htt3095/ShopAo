package com.finalproject2.controller;

import com.cloudinary.Cloudinary;
import com.finalproject2.entity.Account;
import com.finalproject2.entity.AccountVoucher;
import com.finalproject2.entity.Order;
import com.finalproject2.entity.OrderItem;
import com.finalproject2.entity.PaymentMethod;
import com.finalproject2.entity.ProductVariant;
import com.finalproject2.entity.Voucher;
import com.finalproject2.exception.BadRequestException;
import com.finalproject2.exception.NotFoundException;
import com.finalproject2.repository.AccountRepository;
import com.finalproject2.repository.AccountVoucherRepository;
import com.finalproject2.repository.CartItemRepository;
import com.finalproject2.repository.CartRepository;
import com.finalproject2.repository.OrderItemRepository;
import com.finalproject2.repository.OrderRepository;
import com.finalproject2.repository.PaymentMethodRepository;
import com.finalproject2.repository.ProductVariantRepository;
import com.finalproject2.repository.VoucherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(originPatterns = "*")
public class OrderController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final PaymentMethodRepository paymentRepo;
    private final VoucherRepository voucherRepo;
    private final ProductVariantRepository variantRepo;
    private final AccountRepository accountRepo;
    private final AccountVoucherRepository accountVoucherRepo;
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final Cloudinary cloudinary;

    public OrderController(
            OrderRepository orderRepo,
            OrderItemRepository orderItemRepo,
            PaymentMethodRepository paymentRepo,
            VoucherRepository voucherRepo,
            ProductVariantRepository variantRepo,
            AccountRepository accountRepo,
            AccountVoucherRepository accountVoucherRepo,
            CartRepository cartRepo,
            CartItemRepository cartItemRepo,
            Cloudinary cloudinary
    ) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.paymentRepo = paymentRepo;
        this.voucherRepo = voucherRepo;
        this.variantRepo = variantRepo;
        this.accountRepo = accountRepo;
        this.accountVoucherRepo = accountVoucherRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.cloudinary = cloudinary;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        Integer accountId = asInteger(payload.get("accountId"));
        if (accountId == null) {
            throw new BadRequestException("Tài khoản không tồn tại");
        }

        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new BadRequestException("Tài khoản không tồn tại"));

        Long pmId = asLong(payload.get("paymentMethodId"));
        if (pmId == null) {
            throw new BadRequestException("Phương thức thanh toán không hợp lệ");
        }

        PaymentMethod pm = paymentRepo.findById(pmId)
                .orElseThrow(() -> new BadRequestException("Phương thức thanh toán không hợp lệ"));

        String voucherCode = asString(payload.get("voucherCode"));
        Long voucherId = asLong(payload.get("voucherId"));
        Voucher voucher = null;
        if (voucherCode != null && !voucherCode.isBlank()) {
            voucher = voucherRepo.findByCode(voucherCode.trim())
                    .orElseThrow(() -> new BadRequestException("Mã giảm giá không tồn tại"));
        } else if (voucherId != null) {
            voucher = voucherRepo.findById(voucherId)
                    .orElseThrow(() -> new BadRequestException("Mã giảm giá không tồn tại"));
        }

        List<Map<String, Object>> itemsReq = extractOrderItems(payload);
        if (itemsReq == null || itemsReq.isEmpty()) {
            throw new BadRequestException("Giỏ hàng đang trống, không thể đặt hàng!");
        }

        Order order = new Order();
        order.setAccount(account);
        order.setCreatedAt(Instant.now());
        order.setStatus("NEW");
        order.setFullname(asString(payload.get("fullname")));
        order.setPhone(asString(payload.get("phone")));

        String shippingAddress = asString(payload.get("shippingAddress"));
        if (shippingAddress == null || shippingAddress.isBlank()) {
            shippingAddress = asString(payload.get("address"));
        }
        order.setShippingAddress(shippingAddress);

        order.setPaymentStatus("PENDING");
        order.setPaymentMethod(pm);
        if (voucher != null) {
            order.setVoucher(voucher);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (Map<String, Object> itemReq : itemsReq) {
            Long variantId = extractVariantId(itemReq);
            Integer qty = asInteger(itemReq.get("quantity"));

            if (variantId == null) {
                throw new BadRequestException("Sản phẩm không hợp lệ");
            }
            if (qty == null || qty <= 0) {
                throw new BadRequestException("Số lượng sản phẩm không hợp lệ");
            }

            ProductVariant variant = variantRepo.findById(variantId)
                    .orElseThrow(() -> new BadRequestException("Sản phẩm không tồn tại"));

            if (!isVariantSellable(variant)) {
                throw new BadRequestException("Sản phẩm " + variant.getProduct().getName() + " hiện không mở bán!");
            }

            int updatedRows = variantRepo.decrementStockIfAvailable(variantId, qty);
            if (updatedRows == 0) {
                throw new BadRequestException("Sản phẩm " + variant.getProduct().getName() + " không đủ số lượng trong kho!");
            }

            BigDecimal price = variant.getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(qty)));

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setVariant(variant);
            oi.setQuantity(qty);
            oi.setPrice(price);
            orderItems.add(oi);
        }

        BigDecimal shippingFee = resolveShippingFee(payload);
        BigDecimal payableBase = subtotal.add(shippingFee);

        if (voucher != null) {
            validateVoucherForOrder(voucher, subtotal);
        }

        BigDecimal discount = calculateDiscount(voucher, payableBase);
        BigDecimal finalAmount = payableBase.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        order.setTotalMoney(payableBase);
        order.setDiscountAmount(discount);
        order.setFinalAmount(finalAmount);

        Order savedOrder = orderRepo.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
        }
        orderItemRepo.saveAll(orderItems);

        if (savedOrder.getVoucher() != null) {
            Voucher v = savedOrder.getVoucher();
            int currentUsed = (v.getUsedCount() != null) ? v.getUsedCount() : 0;
            v.setUsedCount(currentUsed + 1);
            voucherRepo.save(v);

            AccountVoucher av = new AccountVoucher();
            av.setAccount(account);
            av.setVoucher(v);
            av.setUsedAt(Instant.now());
            accountVoucherRepo.save(av);
        }

        cartRepo.findByAccountId(accountId)
                .ifPresent(cart -> cartItemRepo.deleteByCartId(cart.getId()));

        return ResponseEntity.ok(Map.of("success", true, "orderId", savedOrder.getId()));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

        String oldStatus = order.getStatus();
        String newStatus = asString(req.get("status"));

        if ("RETURN_REQUEST".equals(newStatus)) {
            boolean alreadyReturned = oldStatus != null && (
                    oldStatus.contains("RETURN")
                            || oldStatus.contains("REFUND")
                            || oldStatus.equals("HOAN_TRA")
                            || oldStatus.equals("HOAN_TIEN")
                            || oldStatus.equals("YEU_CAU_TRA")
                            || oldStatus.equals("TRA_HANG")
            );
            if (alreadyReturned) {
                throw new BadRequestException("Đơn hàng này đã được gửi yêu cầu hoàn trả trước đó, không thể hoàn thêm lần nữa!");
            }
        }

        if (oldStatus != null
                && !oldStatus.equals(newStatus)
                && ("CANCELLED".equals(newStatus)
                || "RETURNED".equals(newStatus)
                || "DAMAGED".equals(newStatus)
                || "LOST".equals(newStatus))) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    variantRepo.save(variant);
                }
            }
        }

        if (newStatus != null) {
            order.setStatus(newStatus);
        }

        String pStatus = asString(req.get("paymentStatus"));
        if (pStatus != null) {
            order.setPaymentStatus(pStatus);
        }

        String returnReason = asString(req.get("returnReason"));
        if (returnReason != null && !returnReason.isEmpty()) {
            order.setReturnReason(returnReason);
        }

        String returnImages = asString(req.get("returnImages"));
        if (returnImages != null && !returnImages.isBlank()) {
            order.setReturnImages(returnImages);
        }

        String fullname = asString(req.get("fullname"));
        if (fullname != null && !fullname.trim().isEmpty()) {
            order.setFullname(fullname);
        }

        String phone = asString(req.get("phone"));
        if (phone != null) {
            order.setPhone(phone);
        }

        String email = asString(req.get("email"));
        if (email != null) {
            order.setEmail(email);
        }

        String shippingAddress = asString(req.get("shippingAddress"));
        if (shippingAddress == null) {
            shippingAddress = asString(req.get("address"));
        }
        if (shippingAddress != null) {
            order.setShippingAddress(shippingAddress);
        }

        orderRepo.save(order);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/return-images")
    @Transactional
    public ResponseEntity<?> uploadReturnImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            Order order = orderRepo.findById(id)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

            List<String> uploadedUrls = new ArrayList<>();

            String existing = order.getReturnImages();
            if (existing != null && !existing.isBlank()) {
                existing = existing.trim();
                if (existing.startsWith("[")) {
                    existing = existing.substring(1, existing.length() - 1);
                    for (String s : existing.split(",")) {
                        String url = s.trim().replaceAll("^\"|\"$", "");
                        if (!url.isEmpty()) {
                            uploadedUrls.add(url);
                        }
                    }
                }
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                Map uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        com.cloudinary.utils.ObjectUtils.asMap(
                                "folder", "return_images",
                                "resource_type", "image"
                        )
                );
                uploadedUrls.add(uploadResult.get("secure_url").toString());
            }

            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < uploadedUrls.size(); i++) {
                if (i > 0) {
                    sb.append(",");
                }
                sb.append("\"").append(uploadedUrls.get(i)).append("\"");
            }
            sb.append("]");

            order.setReturnImages(sb.toString());
            orderRepo.save(order);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "returnImages", uploadedUrls
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        return ResponseEntity.ok(mapOrderToMap(order));
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Order> orders = orderRepo.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(orders.map(this::mapOrderToMap));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getOrdersByAccount(@PathVariable Integer accountId) {
        List<Order> list = orderRepo.findByAccountId(accountId);
        return ResponseEntity.ok(list.stream().map(this::mapOrderToMap).toList());
    }

    private Map<String, Object> mapOrderToMap(Order order) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("status", order.getStatus());
        map.put("totalMoney", order.getTotalMoney());
        map.put("discountAmount", order.getDiscountAmount());
        map.put("finalAmount", order.getFinalAmount());
        map.put("fullname", order.getFullname());
        map.put("fullName", order.getFullname());
        map.put("phone", order.getPhone());
        map.put("shippingAddress", order.getShippingAddress());
        map.put("paymentStatus", order.getPaymentStatus());
        map.put("returnReason", order.getReturnReason());

        String returnImagesJson = order.getReturnImages();
        if (returnImagesJson != null && !returnImagesJson.isBlank()) {
            List<String> imgList = new ArrayList<>();
            String trimmed = returnImagesJson.trim();
            if (trimmed.startsWith("[")) {
                trimmed = trimmed.substring(1, trimmed.length() - 1);
                for (String s : trimmed.split(",")) {
                    String url = s.trim().replaceAll("^\"|\"$", "");
                    if (!url.isEmpty()) {
                        imgList.add(url);
                    }
                }
            }
            map.put("returnImages", imgList);
        } else {
            map.put("returnImages", new ArrayList<>());
        }

        map.put("createdAt", order.getCreatedAt());
        map.put("accountId", order.getAccount() != null ? order.getAccount().getId() : null);

        if (order.getPaymentMethod() != null) {
            map.put("paymentMethodName", order.getPaymentMethod().getName());
        }

        List<Map<String, Object>> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem oi : order.getOrderItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", oi.getId());
                itemMap.put("quantity", oi.getQuantity());
                itemMap.put("price", oi.getPrice());

                ProductVariant variant = oi.getVariant();
                if (variant != null) {
                    itemMap.put("variantId", variant.getId());
                    if (variant.getProduct() != null) {
                        itemMap.put("productName", variant.getProduct().getName());
                        itemMap.put(
                                "imageUrl",
                                variant.getImageUrl() != null
                                        ? variant.getImageUrl()
                                        : variant.getProduct().getImageUrl()
                        );
                    }
                    if (variant.getColor() != null) {
                        itemMap.put("colorName", variant.getColor().getName());
                    }
                    if (variant.getSize() != null) {
                        itemMap.put("sizeName", variant.getSize().getName());
                    }
                }
                items.add(itemMap);
            }
        }

        map.put("items", items);
        map.put("orderItems", items);
        return map;
    }

    private void validateVoucherForOrder(Voucher voucher, BigDecimal orderTotal) {
        if (!Boolean.TRUE.equals(voucher.getIsActive())) {
            throw new BadRequestException("Mã giảm giá không còn hoạt động!");
        }

        Instant now = Instant.now();
        if (now.isBefore(voucher.getStartDate())) {
            throw new BadRequestException("Mã giảm giá chưa bắt đầu hoạt động");
        }
        if (now.isAfter(voucher.getEndDate())) {
            throw new BadRequestException("Mã giảm giá đã hết hạn");
        }

        int usedCount = voucher.getUsedCount() != null ? voucher.getUsedCount() : 0;
        if (voucher.getUsageLimit() != null && voucher.getUsageLimit() > 0 && usedCount >= voucher.getUsageLimit()) {
            throw new BadRequestException("Mã giảm giá đã đạt giới hạn sử dụng");
        }

        if (orderTotal != null
                && voucher.getMinOrderValue() != null
                && orderTotal.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new BadRequestException("Giá trị đơn hàng chưa đạt mức tối thiểu để sử dụng mã giảm giá");
        }
    }

    private BigDecimal calculateDiscount(Voucher voucher, BigDecimal payableBase) {
        if (voucher == null || payableBase == null || payableBase.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        if ("PERCENT".equals(voucher.getDiscountType())) {
            discount = payableBase.multiply(voucher.getDiscountValue())
                    .divide(new BigDecimal(100), 0, RoundingMode.HALF_UP);
            if (voucher.getMaxDiscountAmount() != null && discount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
                discount = voucher.getMaxDiscountAmount();
            }
        } else {
            discount = voucher.getDiscountValue();
        }

        if (discount == null || discount.compareTo(BigDecimal.ZERO) < 0) {
            discount = BigDecimal.ZERO;
        }
        if (discount.compareTo(payableBase) > 0) {
            discount = payableBase;
        }
        return discount;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractOrderItems(Map<String, Object> payload) {
        if (payload.get("items") instanceof List) {
            return (List<Map<String, Object>>) payload.get("items");
        }
        if (payload.get("cartItems") instanceof List) {
            return (List<Map<String, Object>>) payload.get("cartItems");
        }
        if (payload.get("cart") instanceof List) {
            return (List<Map<String, Object>>) payload.get("cart");
        }
        if (payload.get("orderItems") instanceof List) {
            return (List<Map<String, Object>>) payload.get("orderItems");
        }
        return null;
    }

    private Long extractVariantId(Map<String, Object> itemReq) {
        if (itemReq == null) {
            return null;
        }

        Long direct = asLong(itemReq.get("variantId"));
        if (direct != null) {
            return direct;
        }

        direct = asLong(itemReq.get("variant_id"));
        if (direct != null) {
            return direct;
        }

        direct = asLong(itemReq.get("productVariantId"));
        if (direct != null) {
            return direct;
        }

        direct = asLong(itemReq.get("product_variant_id"));
        if (direct != null) {
            return direct;
        }

        Object nested = itemReq.get("variant");
        if (nested instanceof Map<?, ?> nestedMap) {
            return asLong(nestedMap.get("id"));
        }

        return null;
    }

    private boolean isVariantSellable(ProductVariant variant) {
        if (variant == null) {
            return false;
        }

        String status = variant.getStatus();
        if (status == null || status.isBlank()) {
            return true;
        }

        String normalized = status.trim().toUpperCase();
        return !("HIDDEN".equals(normalized)
                || "INACTIVE".equals(normalized)
                || "STOP_SELLING".equals(normalized)
                || "DISCONTINUED".equals(normalized));
    }

    private BigDecimal resolveShippingFee(Map<String, Object> payload) {
        BigDecimal fee = asBigDecimal(payload.get("shippingFee"));
        if (fee == null) fee = asBigDecimal(payload.get("shipping_fee"));
        if (fee == null) fee = asBigDecimal(payload.get("shippingAmount"));
        if (fee == null) fee = asBigDecimal(payload.get("shipping_amount"));
        if (fee == null) fee = asBigDecimal(payload.get("deliveryFee"));
        if (fee == null) fee = asBigDecimal(payload.get("delivery_fee"));
        if (fee == null) fee = asBigDecimal(payload.get("deliveryAmount"));
        if (fee == null) fee = asBigDecimal(payload.get("delivery_amount"));
        if (fee == null) fee = asBigDecimal(payload.get("shipFee"));
        if (fee == null) fee = asBigDecimal(payload.get("ship_fee"));
        if (fee == null) fee = BigDecimal.ZERO;

        if (fee.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }
        return fee;
    }

    private BigDecimal asBigDecimal(Object v) {
        if (v == null) return null;
        if (v instanceof BigDecimal bd) return bd;
        try {
            String raw = v.toString().trim();
            if (raw.isEmpty()) return null;
            raw = raw.replace(",", "");
            return new BigDecimal(raw);
        } catch (Exception e) {
            return null;
        }
    }

    private Integer asInteger(Object v) {
        if (v == null) {
            return null;
        }
        return Integer.valueOf(v.toString());
    }

    private Long asLong(Object v) {
        if (v == null) {
            return null;
        }
        return Long.valueOf(v.toString());
    }

    private String asString(Object v) {
        return v == null ? null : v.toString();
    }
}
