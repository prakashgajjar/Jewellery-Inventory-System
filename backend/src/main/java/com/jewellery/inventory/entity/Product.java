package com.jewellery.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductType type;

    @Column(nullable = false)
    private BigDecimal weight;

    @Column(nullable = false)
    private Integer purity;

    @Column(nullable = false)
    private BigDecimal makingCharges;

    @Column(nullable = false)
    private Integer stock;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ProductType {
        RING, BRACELET, NECKLACE, EARRING, ANKLET, PENDANT, CHAIN, OTHER
    }
}
