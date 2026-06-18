package com.finalproject2.controller;

import com.finalproject2.entity.Color;
import com.finalproject2.repository.ColorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colors")
@CrossOrigin(originPatterns = "*")
public class ColorController {

    private final ColorRepository colorRepository;

    public ColorController(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Color>> getAll() {
        return ResponseEntity.ok(colorRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Color> addColor(@RequestBody java.util.Map<String, String> req) {
        String name = req.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Color c = new Color();
        c.setName(name.trim());
        return ResponseEntity.ok(colorRepository.save(c));
    }
}