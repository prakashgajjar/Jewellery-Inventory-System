package com.jewellery.inventory.repository;

import com.jewellery.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByType(String type);
    List<Product> findByStockLessThan(Integer stock);
    List<Product> findByNameContainingIgnoreCase(String name);
}
