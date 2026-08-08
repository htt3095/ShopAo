package com.finalproject2.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.finalproject2.entity.Product;
import com.finalproject2.model.request.ProductRequest;
import com.finalproject2.model.response.ProductResponse;
import com.finalproject2.repository.ProductRepository;
import com.finalproject2.service.ProductService;
import com.finalproject2.service.QRCodeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = "*")
public class ProductController {

    private final ProductService svc;
    private final ProductRepository productRepo;
    private final Cloudinary cloudinary;
    private final QRCodeService qrCodeService;

    // Cập nhật Constructor để có đủ công cụ
    public ProductController(ProductService svc, ProductRepository productRepo, Cloudinary cloudinary, QRCodeService qrCodeService) {
        this.svc = svc;
        this.productRepo = productRepo;
        this.cloudinary = cloudinary;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(svc.create(req));
    }

    @GetMapping
    public ResponseEntity<java.util.List<ProductResponse>> getAll() {
        return ResponseEntity.ok(svc.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(svc.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- API UPLOAD ẢNH CHO SẢN PHẨM LÊN CLOUDINARY ---
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            // 1. Tìm sản phẩm trong Database
            Product product = productRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

            // 2. Đẩy ảnh lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

            // 3. Lấy đường link ảnh (URL an toàn)
            String imageUrl = uploadResult.get("secure_url").toString();

            // 4. Lưu trực tiếp cái link đó vào cột image_url của Database
            product.setImageUrl(imageUrl);
            productRepo.save(product);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "imageUrl", imageUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    //---QR--//
    @PostMapping("/{id}/generate-qr")
    public ResponseEntity<?> generateQR(@PathVariable Long id) {
        try {
            // Gọi instance method
            String qrPath = qrCodeService.generateProductQR(id);
            // Cập nhật QR vào database (cần thêm trường qrCode trong Product)
            Product product = productRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
            product.setQrCode(qrPath);
            productRepo.save(product);
            return ResponseEntity.ok(Map.of("qrPath", qrPath));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi tạo QR: " + e.getMessage()));
        }
    }
}