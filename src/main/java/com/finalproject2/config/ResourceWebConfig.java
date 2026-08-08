package com.finalproject2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourceWebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ánh xạ URL /qr/** tới thư mục vật lý uploads/qr/
        registry.addResourceHandler("/qr/**")
                .addResourceLocations("file:uploads/qr/");
    }
}