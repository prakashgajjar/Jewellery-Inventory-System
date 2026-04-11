package com.jewellery.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RateDTO {
    private Long id;
    private BigDecimal goldRate;
    private BigDecimal silverRate;
    private LocalDate date;
}
