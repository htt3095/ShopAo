package com.finalproject2.repository;

import com.finalproject2.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Modifying
    @Query("""
            update ProductVariant v
            set v.stockQuantity = v.stockQuantity - :quantity
            where v.id = :variantId
              and v.stockQuantity >= :quantity
            """)
    int decrementStockIfAvailable(@Param("variantId") Long variantId, @Param("quantity") Integer quantity);
}
