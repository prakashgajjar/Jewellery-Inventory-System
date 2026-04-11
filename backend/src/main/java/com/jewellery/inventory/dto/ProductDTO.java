package com.jewellery.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String type;
    private BigDecimal weight;
    private Integer purity;
    private BigDecimal makingCharges;
    private Integer stock;
    private String imageUrl;
    private String description;
    private BigDecimal price;
}
