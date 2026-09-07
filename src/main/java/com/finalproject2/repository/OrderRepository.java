package com.finalproject2.repository;

import com.finalproject2.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByAccountId(Integer accountId);
    @Query("""
            select case when count(o) > 0 then true else false end
            from Order o
            join o.orderItems orderItem
            where o.account.id = :accountId
              and o.status = :status
              and orderItem.variant.product.id = :productId
            """)
    boolean hasPurchasedProduct(
            @Param("accountId") Integer accountId,
            @Param("status") String status,
            @Param("productId") Long productId
    );

    List<Order> findByStatusAndPaymentStatus(String status, String paymentStatus);
}