package com.finalproject2.controller;

import com.finalproject2.entity.Size;
import com.finalproject2.repository.SizeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@CrossOrigin(originPatterns = "*")
public class SizeController {

    private final SizeRepository sizeRepository;

    public SizeController(SizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Size>> getAll() {
        return ResponseEntity.ok(sizeRepository.findAll());
    }
}