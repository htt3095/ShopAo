package com.finalproject2.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class QRCodeService {

    @Value("${app.base-url}")
    private String baseUrl;

    public String generateProductQR(Long productId) throws Exception {
        // Nội dung QR: URL frontend
        String productUrl = baseUrl + "/product/" + productId;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        BitMatrix matrix = new MultiFormatWriter().encode(productUrl, BarcodeFormat.QR_CODE, 250, 250);
        MatrixToImageWriter.writeToStream(matrix, "PNG", baos);

        String fileName = "product-" + productId + ".png";
        // Lưu vào thư mục uploads/qr/
        Path path = Paths.get("uploads/qr/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, baos.toByteArray());

        return "/qr/" + fileName;
    }
    public String generateVariantQR(Long variantId) throws Exception {
        String productUrl = baseUrl + "/product/variant/" + variantId; // Hoặc đường dẫn riêng
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        BitMatrix matrix = new MultiFormatWriter().encode(productUrl, BarcodeFormat.QR_CODE, 250, 250);
        MatrixToImageWriter.writeToStream(matrix, "PNG", baos);

        String fileName = "variant-" + variantId + ".png";
        Path path = Paths.get("uploads/qr/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, baos.toByteArray());

        return "/qr/" + fileName;
    }
}