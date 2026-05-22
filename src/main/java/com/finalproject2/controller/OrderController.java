package com.finalproject2.controller;

import com.finalproject2.entity.*;
import com.finalproject2.repository.*;
import com.finalproject2.exception.BadRequestException;
import com.finalproject2.exception.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;

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

    public OrderController(OrderRepository orderRepo,
            OrderItemRepository orderItemRepo,
            PaymentMethodRepository paymentRepo,
            VoucherRepository voucherRepo,
            ProductVariantRepository variantRepo,
            AccountRepository accountRepo,
            AccountVoucherRepository accountVoucherRepo,
            CartRepository cartRepo,
            CartItemRepository cartItemRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.paymentRepo = paymentRepo;
        this.voucherRepo = voucherRepo;
        this.variantRepo = variantRepo;
        this.accountRepo = accountRepo;
        this.accountVoucherRepo = accountVoucherRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            Integer accountId = asInteger(payload.get("accountId"));
            Account account = accountRepo.findById(accountId)
                    .orElseThrow(() -> new BadRequestException("Tài khoản không tồn tại"));

            // 1. Tạo đơn hàng cơ bản
            Order order = new Order();
            order.setAccount(account);
            order.setCreatedAt(Instant.now());
            order.setStatus("NEW");
            order.setFullname(asString(payload.get("fullname")));
            order.setPhone(asString(payload.get("phone")));
            order.setShippingAddress(asString(payload.get("shippingAddress")));
            order.setPaymentStatus("PENDING");

            Long pmId = asLong(payload.get("paymentMethodId"));
            PaymentMethod pm = paymentRepo.findById(pmId)
                    .orElseThrow(() -> new BadRequestException("Phương thức thanh toán không hợp lệ"));
            order.setPaymentMethod(pm);

            // 2. Xử lý Voucher (nếu có)
            String voucherCode = asString(payload.get("voucherCode"));
            if (voucherCode != null && !voucherCode.isEmpty()) {
                Voucher v = voucherRepo.findByCode(voucherCode)
                        .orElseThrow(() -> new BadRequestException("Mã giảm giá không tồn tại"));
                order.setVoucher(v);
            }

            // 3. Tính toán tiền và Lưu Item
            List<Map<String, Object>> itemsReq = null;

            // Hứng mọi thể loại tên biến từ các màn hình khác nhau (User Checkout, POS,
            // v.v...)
            if (payload.get("items") != null) {
                itemsReq = (List<Map<String, Object>>) payload.get("items");
            } else if (payload.get("cartItems") != null) {
                itemsReq = (List<Map<String, Object>>) payload.get("cartItems");
            } else if (payload.get("cart") != null) {
                itemsReq = (List<Map<String, Object>>) payload.get("cart");
            } else if (payload.get("orderItems") != null) {
                itemsReq = (List<Map<String, Object>>) payload.get("orderItems");
            }

            // Nếu quét qua 4 tên vẫn không thấy, in ra log để biết Frontend thực sự gửi cái
            // gì
            if (itemsReq == null || itemsReq.isEmpty()) {
                System.out.println("=== LỖI PAYLOAD KHÔNG TÌM THẤY GIỎ HÀNG ===");
                System.out.println("Dữ liệu Frontend gửi xuống: " + payload);
                throw new BadRequestException("Giỏ hàng đang trống, không thể đặt hàng!");
            }

            BigDecimal totalMoney = BigDecimal.ZERO;
            List<OrderItem> orderItems = new ArrayList<>();

            for (Map<String, Object> itemReq : itemsReq) {
                Long variantId = asLong(itemReq.get("variantId"));
                Integer qty = asInteger(itemReq.get("quantity"));

                ProductVariant variant = variantRepo.findById(variantId)
                        .orElseThrow(() -> new BadRequestException("Sản phẩm không tồn tại"));

                // --- VÁ LỖI 1: KIỂM TRA VÀ TRỪ KHO ---
                if (variant.getStockQuantity() < qty) {
                    throw new BadRequestException(
                            "Sản phẩm " + variant.getProduct().getName() + " không đủ số lượng trong kho!");
                }
                variant.setStockQuantity(variant.getStockQuantity() - qty);
                variantRepo.save(variant);
                // ------------------------------------

                BigDecimal price = variant.getPrice();
                totalMoney = totalMoney.add(price.multiply(BigDecimal.valueOf(qty)));

                OrderItem oi = new OrderItem();
                oi.setOrder(order);
                oi.setVariant(variant);
                oi.setQuantity(qty);
                oi.setPrice(price);
                orderItems.add(oi);
            }

            order.setTotalMoney(totalMoney);

            // Tính số tiền giảm
            BigDecimal discount = BigDecimal.ZERO;
            if (order.getVoucher() != null) {
                Voucher v = order.getVoucher();
                if ("PERCENT".equals(v.getDiscountType())) {
                    discount = totalMoney.multiply(v.getDiscountValue()).divide(new BigDecimal(100),
                            RoundingMode.HALF_UP);
                    if (v.getMaxDiscountAmount() != null
                            && discount.compareTo(v.getMaxDiscountAmount()) > 0) {
                        discount = v.getMaxDiscountAmount();
                    }
                } else {
                    discount = v.getDiscountValue();
                }
            }
            order.setDiscountAmount(discount);
            order.setFinalAmount(totalMoney.subtract(discount));

            // 4. Lưu Đơn hàng
            Order savedOrder = orderRepo.save(order);
            orderItemRepo.saveAll(orderItems);

            // --- VÁ LỖI 2: CẬP NHẬT LƯỢT DÙNG VOUCHER ---
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
            // -------------------------------------------

            // 5. Xóa giỏ hàng sau khi đặt thành công
            cartRepo.findByAccountId(accountId).ifPresent(cart -> {
                cartItemRepo.deleteByCartId(cart.getId());
            });

            return ResponseEntity.ok(Map.of("success", true, "orderId", savedOrder.getId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

        String oldStatus = order.getStatus();
        String newStatus = asString(req.get("status"));

        // --- VÁ LỖI 3: CỘNG LẠI KHO KHI HỦY/HOÀN ĐƠN ---
        if (oldStatus != null && !oldStatus.equals(newStatus) &&
                ("CANCELLED".equals(newStatus) || "RETURNED".equals(newStatus))) {

            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    variantRepo.save(variant);
                }
            }
        }
        // ----------------------------------------------

        if (newStatus != null)
            order.setStatus(newStatus);
        String pStatus = asString(req.get("paymentStatus"));
        String returnReason = asString(req.get("returnReason"));
        if (returnReason != null && !returnReason.isEmpty()) {
            order.setReturnReason(returnReason);
        }
        if (pStatus != null)
            order.setPaymentStatus(pStatus);

        orderRepo.save(order);
        return ResponseEntity.ok(Map.of("success", true));
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
            @RequestParam(defaultValue = "10") int size) {
        Page<Order> orders = orderRepo.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(orders.map(this::mapOrderToMap));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getOrdersByAccount(@PathVariable Integer accountId) {
        List<Order> list = orderRepo.findByAccountId(accountId);
        return ResponseEntity.ok(list.stream().map(this::mapOrderToMap).toList());
    }

    // --- HELPER METHODS ---
    private Map<String, Object> mapOrderToMap(Order order) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("status", order.getStatus());
        map.put("totalMoney", order.getTotalMoney());
        map.put("discountAmount", order.getDiscountAmount());
        map.put("finalAmount", order.getFinalAmount());
        map.put("fullname", order.getFullname());
        map.put("phone", order.getPhone());
        map.put("shippingAddress", order.getShippingAddress());
        map.put("paymentStatus", order.getPaymentStatus());
        map.put("returnReason", order.getReturnReason());
        map.put("createdAt", order.getCreatedAt());
        map.put("accountId", order.getAccount() != null ? order.getAccount().getId() : null);

        if (order.getPaymentMethod() != null) {
            map.put("paymentMethodName", order.getPaymentMethod().getName());
        }

        // --- BỔ SUNG: ĐÓNG GÓI DANH SÁCH SẢN PHẨM GỬI CHO FRONTEND ---
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
                        // Lấy ảnh của biến thể, nếu không có thì lấy ảnh gốc của sản phẩm
                        itemMap.put("imageUrl", variant.getImageUrl() != null ? variant.getImageUrl()
                                : variant.getProduct().getImageUrl());
                    }
                    if (variant.getColor() != null)
                        itemMap.put("colorName", variant.getColor().getName());
                    if (variant.getSize() != null)
                        itemMap.put("sizeName", variant.getSize().getName());
                }
                items.add(itemMap);
            }
        }

        // Gắn danh sách vào Response (Gắn cả 2 tên để lót đường cho mọi loại Frontend)
        map.put("items", items);
        map.put("orderItems", items);
        // --------------------------------------------------------------

        return map;
    }

    private Integer asInteger(Object v) {
        if (v == null)
            return null;
        return Integer.valueOf(v.toString());
    }

    private Long asLong(Object v) {
        if (v == null)
            return null;
        return Long.valueOf(v.toString());
    }

    private String asString(Object v) {
        return v == null ? null : v.toString();
    }
}