package com.jewellery.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private BigDecimal subtotal;
    private BigDecimal gst;
    private BigDecimal totalAmount;
    private String status;
    private String invoiceNumber;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}
