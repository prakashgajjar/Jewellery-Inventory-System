package com.jewellery.inventory.controller;

import com.jewellery.inventory.dto.ProductDTO;
import com.jewellery.inventory.dto.ApiResponse;
import com.jewellery.inventory.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        log.info("Fetching all products");
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            log.info("Fetching product: {}", id);
            ProductDTO product = productService.getProduct(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<ProductDTO>> searchProducts(@PathVariable String name) {
        log.info("Searching products: {}", name);
        List<ProductDTO> products = productService.searchProducts(name);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProductDTO>> getProductsByType(@PathVariable String type) {
        log.info("Fetching products by type: {}", type);
        List<ProductDTO> products = productService.getProductsByType(type);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/low-stock/{threshold}")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts(@PathVariable Integer threshold) {
        log.info("Fetching low stock products with threshold: {}", threshold);
        List<ProductDTO> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO dto) {
        try {
            log.info("Creating product: {}", dto.getName());
            ProductDTO product = productService.createProduct(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
        try {
            log.info("Updating product: {}", id);
            ProductDTO product = productService.updateProduct(id, dto);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            log.info("Deleting product: {}", id);
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
