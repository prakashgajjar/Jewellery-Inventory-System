package com.jewellery.inventory.controller;

import com.jewellery.inventory.dto.RateDTO;
import com.jewellery.inventory.dto.ApiResponse;
import com.jewellery.inventory.service.RateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rates")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RateController {

    @Autowired
    private RateService rateService;

    @GetMapping
    public ResponseEntity<List<RateDTO>> getAllRates() {
        log.info("Fetching all rates");
        List<RateDTO> rates = rateService.getAllRates();
        return ResponseEntity.ok(rates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRate(@PathVariable Long id) {
        try {
            log.info("Fetching rate: {}", id);
            RateDTO rate = rateService.getRate(id);
            return ResponseEntity.ok(rate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestRate() {
        try {
            log.info("Fetching latest rate");
            RateDTO rate = rateService.getLatestRate();
            return ResponseEntity.ok(rate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/by-date/{date}")
    public ResponseEntity<?> getRateByDate(@PathVariable LocalDate date) {
        try {
            log.info("Fetching rate for date: {}", date);
            RateDTO rate = rateService.getRateByDate(date);
            return ResponseEntity.ok(rate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createRate(@RequestBody RateDTO dto) {
        try {
            log.info("Creating rate for date: {}", dto.getDate());
            RateDTO rate = rateService.createRate(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(rate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateRate(@PathVariable Long id, @RequestBody RateDTO dto) {
        try {
            log.info("Updating rate: {}", id);
            RateDTO rate = rateService.updateRate(id, dto);
            return ResponseEntity.ok(rate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
