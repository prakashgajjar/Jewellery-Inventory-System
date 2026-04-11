package com.jewellery.inventory.service;

import com.jewellery.inventory.dto.ProductDTO;
import com.jewellery.inventory.entity.Product;
import com.jewellery.inventory.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setType(Product.ProductType.valueOf(dto.getType()));
        product.setWeight(dto.getWeight());
        product.setPurity(dto.getPurity());
        product.setMakingCharges(dto.getMakingCharges());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());

        Product savedProduct = productRepository.save(product);
        log.info("Product created: {}", savedProduct.getId());
        return toDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();
        product.setName(dto.getName());
        product.setType(Product.ProductType.valueOf(dto.getType()));
        product.setWeight(dto.getWeight());
        product.setPurity(dto.getPurity());
        product.setMakingCharges(dto.getMakingCharges());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());

        Product updatedProduct = productRepository.save(product);
        log.info("Product updated: {}", id);
        return toDTO(updatedProduct);
    }

    public ProductDTO getProduct(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        return toDTO(productOpt.get());
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByType(String type) {
        return productRepository.findByType(type).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getLowStockProducts(Integer threshold) {
        return productRepository.findByStockLessThan(threshold).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
        log.info("Product deleted: {}", id);
    }

    public void updateStock(Long id, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        Product product = productOpt.get();
        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
    }

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setType(product.getType().toString());
        dto.setWeight(product.getWeight());
        dto.setPurity(product.getPurity());
        dto.setMakingCharges(product.getMakingCharges());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());
        return dto;
    }
}
