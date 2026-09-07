package com.finalproject2.service;

import com.finalproject2.entity.Order;
import com.finalproject2.entity.OrderItem;
import com.finalproject2.entity.ProductVariant;
import com.finalproject2.repository.OrderRepository;
import com.finalproject2.repository.ProductVariantRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class OrderCleanupService {

    private final OrderRepository orderRepo;
    private final ProductVariantRepository variantRepo;

    public OrderCleanupService(OrderRepository orderRepo, ProductVariantRepository variantRepo) {
        this.orderRepo = orderRepo;
        this.variantRepo = variantRepo;
    }

    // Chạy mỗi 1 phút
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredVnpayOrders() {
        // Tìm các đơn hàng cách đây > 15 phút
        Instant threshold = Instant.now().minus(15, ChronoUnit.MINUTES);
        
        // Tìm đơn hàng đang chờ thanh toán
        List<Order> pendingOrders = orderRepo.findByStatusAndPaymentStatus("NEW", "PENDING");
        
        List<Order> expiredOrders = pendingOrders.stream()
            .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isBefore(threshold))
            .filter(o -> o.getPaymentMethod() != null && 
                         ("VNPAY".equalsIgnoreCase(o.getPaymentMethod().getName()) || 
                          "VN PAY".equalsIgnoreCase(o.getPaymentMethod().getName())))
            .toList();

        for (Order order : expiredOrders) {
            System.out.println("Auto-canceling expired VNPay order: " + order.getId());
            order.setStatus("CANCELLED");
            order.setPaymentStatus("FAILED");
            
            // Hoàn lại số lượng tồn kho
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    variantRepo.save(variant);
                }
            }
            orderRepo.save(order);
        }
    }
}
