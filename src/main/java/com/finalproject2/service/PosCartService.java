package com.finalproject2.service;

import com.finalproject2.entity.ProductVariant;

import com.finalproject2.model.request.PosCart;
import com.finalproject2.model.request.PosCartItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PosCartService {

    // Lưu giỏ hàng tạm: invoiceId -> List<PosCartItem>
    private final Map<Long, List<PosCartItem>> carts = new ConcurrentHashMap<>();

    public PosCart addItem(Long invoiceId, ProductVariant variant, int quantity) {
        carts.computeIfAbsent(invoiceId, k -> new ArrayList<>());
        List<PosCartItem> items = carts.get(invoiceId);

        // Tìm item đã tồn tại
        PosCartItem existing = items.stream()
                .filter(item -> item.getVariantId().equals(variant.getId()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            PosCartItem newItem = new PosCartItem();
            newItem.setVariantId(variant.getId());
            newItem.setProductId(variant.getProduct().getId());
            newItem.setProductName(variant.getProduct().getName());
            newItem.setImageUrl(variant.getImageUrl());
            newItem.setPrice(variant.getPrice());
            newItem.setQuantity(quantity);
            items.add(newItem);
        }

        return new PosCart(invoiceId, items);
    }

    public PosCart getCart(Long invoiceId) {
        List<PosCartItem> items = carts.getOrDefault(invoiceId, new ArrayList<>());
        return new PosCart(invoiceId, items);
    }
}
