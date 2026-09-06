package com.finalproject2.controller;

import com.finalproject2.entity.ProductVariant;

import com.finalproject2.model.request.PosAddRequest;
import com.finalproject2.model.request.PosCart;
import com.finalproject2.model.request.PosStockAdjustmentRequest;
import com.finalproject2.repository.ProductVariantRepository;
import com.finalproject2.service.PosCartService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(originPatterns = "*")
public class PosController {

    private final ProductVariantRepository variantRepo;
    private final PosCartService posCartService;

    public PosController(ProductVariantRepository variantRepo, PosCartService posCartService) {
        this.variantRepo = variantRepo;
        this.posCartService = posCartService;
    }

    @PostMapping("/cart/add-by-qr")
    public ResponseEntity<PosCart> addByQR(@RequestBody PosAddRequest request) {
        Long invoiceId = request.getInvoiceId();
        Long variantId = request.getVariantId();
        Integer quantity = request.getQuantity() != null ? request.getQuantity() : 1;

        ProductVariant variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể"));

        PosCart updatedCart = posCartService.addItem(invoiceId, variant, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping("/cart/{invoiceId}")
    public ResponseEntity<PosCart> getCart(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(posCartService.getCart(invoiceId));
    }

    @PostMapping("/stock/adjust")
    @Transactional
    public ResponseEntity<Void> adjustStock(@RequestBody PosStockAdjustmentRequest request) {
        if (request.getVariantId() == null || request.getReservedQuantityDelta() == null) {
            return ResponseEntity.badRequest().build();
        }

        int delta = request.getReservedQuantityDelta();
        if (delta > 0 && variantRepo.decrementStockIfAvailable(request.getVariantId(), delta) == 0) {
            return ResponseEntity.badRequest().build();
        }
        if (delta < 0) {
            variantRepo.incrementStock(request.getVariantId(), -delta);
        }

        return ResponseEntity.noContent().build();
    }
}
