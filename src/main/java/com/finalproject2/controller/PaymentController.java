package com.finalproject2.controller;

import com.finalproject2.SecurityConfiguration.VNPayConfig;
import com.finalproject2.entity.Order;
import com.finalproject2.repository.OrderRepository;
import com.finalproject2.mapper.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(originPatterns = "*")
public class PaymentController {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepo;

    public PaymentController(VNPayConfig vnPayConfig, OrderRepository orderRepo) {
        this.vnPayConfig = vnPayConfig;
        this.orderRepo = orderRepo;
    }

    @PostMapping("/vnpay/create")
    public ResponseEntity<?> createVnpayPayment(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        try {

            Long orderId = Long.valueOf(payload.get("orderId").toString());
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID " + orderId));

            BigDecimal amount;
            if (payload.get("amount") != null) {
                amount = new BigDecimal(payload.get("amount").toString());
            } else {
                amount = order.getFinalAmount() != null ? order.getFinalAmount() : order.getTotalMoney();
            }

            long vnpAmount = amount.longValue() * 100;

            String vnpTxnRef = String.valueOf(orderId);
            String vnpIpAddr = VNPayUtil.getIpAddress(request);
            String vnpCreateDate = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
                    .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", "2.1.0");
            vnpParams.put("vnp_Command", "pay");
            vnpParams.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
            vnpParams.put("vnp_Amount", String.valueOf(vnpAmount));
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", vnpTxnRef);
            vnpParams.put("vnp_OrderInfo", "Thanh toan don hang Peak Seven #" + orderId);
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
            vnpParams.put("vnp_IpAddr", vnpIpAddr);
            vnpParams.put("vnp_CreateDate", vnpCreateDate);

            String paymentUrl = VNPayUtil.buildPaymentUrl(
                    vnPayConfig.getVnpPayUrl(),
                    vnpParams,
                    vnPayConfig.getVnpHashSecret()
            );

            order.setPaymentStatus("PENDING");
            orderRepo.save(order);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "paymentUrl", paymentUrl,
                    "orderId", orderId
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi tạo thanh toán VNPay: " + e.getMessage()
            ));
        }
    }


    @GetMapping("/vnpay/ipn")
    @Transactional
    public ResponseEntity<?> vnpayIpn(@RequestParam Map<String, String> params) {
        try {
            boolean isValidHash = VNPayUtil.verifyHash(params, vnPayConfig.getVnpHashSecret());
            if (!isValidHash) {
                return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
            }

            String vnpTxnRef = params.get("vnp_TxnRef");
            String vnpResponseCode = params.get("vnp_ResponseCode");
            String vnpTransactionStatus = params.get("vnp_TransactionStatus");
            String vnpAmountStr = params.get("vnp_Amount");

            if (vnpTxnRef == null || vnpTxnRef.isEmpty()) {
                return ResponseEntity.ok(Map.of("RspCode", "01", "Message", "Order not found"));
            }

            Long orderId;
            try {
                orderId = Long.valueOf(vnpTxnRef);
            } catch (NumberFormatException e) {
                return ResponseEntity.ok(Map.of("RspCode", "01", "Message", "Invalid order ID"));
            }

            Optional<Order> optOrder = orderRepo.findById(orderId);
            if (optOrder.isEmpty()) {
                return ResponseEntity.ok(Map.of("RspCode", "01", "Message", "Order not found"));
            }

            Order order = optOrder.get();

            if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                return ResponseEntity.ok(Map.of("RspCode", "02", "Message", "Order already confirmed"));
            }

            if (vnpAmountStr != null) {
                long vnpAmount = Long.parseLong(vnpAmountStr);
                BigDecimal expectedAmount = order.getFinalAmount() != null
                        ? order.getFinalAmount() : order.getTotalMoney();
                long expectedVnpAmount = expectedAmount.longValue() * 100;

                if (vnpAmount != expectedVnpAmount) {
                    return ResponseEntity.ok(Map.of("RspCode", "04", "Message", "Invalid amount"));
                }
            }

            if ("00".equals(vnpResponseCode) && "00".equals(vnpTransactionStatus)) {
                order.setPaymentStatus("PAID");
                order.setStatus("CONFIRMED");
                orderRepo.save(order);
                return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
            } else {
                order.setPaymentStatus("FAILED");
                orderRepo.save(order);
                return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
            }

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Unknown error: " + e.getMessage()));
        }
    }

    @GetMapping("/vnpay/return")
    @Transactional
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        try {
            boolean isValidHash = VNPayUtil.verifyHash(params, vnPayConfig.getVnpHashSecret());
            String vnpTxnRef = params.get("vnp_TxnRef");
            String vnpResponseCode = params.get("vnp_ResponseCode");
            String vnpTransactionNo = params.get("vnp_TransactionNo");
            String vnpAmount = params.get("vnp_Amount");
            if (isValidHash && vnpTxnRef != null && !vnpTxnRef.isEmpty()) {
                try {
                    Long orderId = Long.valueOf(vnpTxnRef);
                    Optional<Order> optOrder = orderRepo.findById(orderId);
                    if (optOrder.isPresent()) {
                        Order order = optOrder.get();
                        if (!"PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                            if ("00".equals(vnpResponseCode)) {
                                order.setPaymentStatus("PAID");
                                order.setStatus("CONFIRMED");
                            } else {
                                order.setPaymentStatus("FAILED");
                            }
                            orderRepo.save(order);
                        }
                    }
                } catch (NumberFormatException ignored) {}
            }
            Map<String, Object> result = new HashMap<>();
            result.put("isValid", isValidHash);
            result.put("orderId", vnpTxnRef);
            result.put("vnpResponseCode", vnpResponseCode);
            result.put("vnpTransactionNo", vnpTransactionNo);
            result.put("amount", vnpAmount != null ? Long.parseLong(vnpAmount) / 100 : 0);
            result.put("success", isValidHash && "00".equals(vnpResponseCode));
            result.put("message", "00".equals(vnpResponseCode)
                    ? "Thanh toán thành công"
                    : "Thanh toán thất bại (Mã lỗi: " + vnpResponseCode + ")");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false, "message", "Lỗi xử lý kết quả VNPay: " + e.getMessage()));
        }
    }
}
