package com.finalproject2.service;

import com.finalproject2.entity.Brand;
import com.finalproject2.entity.Category;
import com.finalproject2.entity.Product;
import com.finalproject2.exception.NotFoundException;
import com.finalproject2.model.request.ProductRequest;
import com.finalproject2.model.response.ProductResponse;
import com.finalproject2.repository.BrandRepository;
import com.finalproject2.repository.CategoryRepository;
import com.finalproject2.repository.ProductRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final BrandRepository brandRepo;
    private final QRCodeService qrCodeService;   // 👈 thêm

    // Cập nhật constructor
    public ProductServiceImpl(ProductRepository productRepo,
                              CategoryRepository categoryRepo,
                              BrandRepository brandRepo,
                              QRCodeService qrCodeService) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
        this.qrCodeService = qrCodeService;
    }

    @Override
    @Transactional
    public ProductResponse create(ProductRequest req) {
        Category cat = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));
        Brand br = brandRepo.findById(req.getBrandId())
                .orElseThrow(() -> new NotFoundException("Brand not found"));

        Product p = new Product();
        p.setName(req.getName());
        p.setProductCode(req.getProductCode());
        p.setDescription(req.getDescription());
        p.setImageUrl(req.getImageUrl());
        p.setCategory(cat);
        p.setBrand(br);
        p.setStatus("AVAILABLE");
        p.setCreatedAt(Instant.now());
        p = productRepo.save(p);

        try {
            String qrPath = qrCodeService.generateProductQR(p.getId());
            p.setQrCode(qrPath);
            productRepo.save(p);
        } catch (Exception e) {
            log.error("Lỗi sinh QR cho sản phẩm {}: {}", p.getId(), e.getMessage(), e);
        }

        return toResponse(p);
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        if (req.getCategoryId() != null) {
            Category cat = categoryRepo.findById(req.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            p.setCategory(cat);
        }
        if (req.getBrandId() != null) {
            Brand br = brandRepo.findById(req.getBrandId())
                    .orElseThrow(() -> new NotFoundException("Brand not found"));
            p.setBrand(br);
        }
        if (req.getName() != null)        p.setName(req.getName());
        if (req.getProductCode() != null) p.setProductCode(req.getProductCode());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getImageUrl() != null)    p.setImageUrl(req.getImageUrl());
        if (req.getStatus() != null)      p.setStatus(req.getStatus());

        p.setUpdatedAt(Instant.now());
        p = productRepo.save(p);

        // (Tùy chọn) Nếu muốn tạo lại QR khi cập nhật, có thể gọi ở đây
        // try { ... } catch...

        return toResponse(p);
    }

    @Override
    public ProductResponse getById(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return toResponse(p);
    }

    @Override
    public List<ProductResponse> getAll() {
        return productRepo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        try {
            productRepo.delete(p);
        } catch (DataIntegrityViolationException e) {
            // Foreign key constraint violation - soft delete by setting status to HIDDEN
            p.setStatus("HIDDEN");
            p.setUpdatedAt(Instant.now());
            productRepo.save(p);
        }
    }

    /**
     * Map thủ công từ entity sang response.
     */
    private ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setProductCode(p.getProductCode());
        r.setDescription(p.getDescription());
        r.setStatus(p.getStatus());
        r.setImageUrl(p.getImageUrl());
        r.setUpdatedAt(p.getUpdatedAt());
        r.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);
        r.setBrandId(p.getBrand()       != null ? p.getBrand().getId()    : null);
        r.setQrCode(p.getQrCode());   // 👈 QUAN TRỌNG: map qrCode
        return r;
    }
}