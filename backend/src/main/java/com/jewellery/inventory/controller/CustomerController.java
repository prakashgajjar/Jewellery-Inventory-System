package com.jewellery.inventory.controller;

import com.jewellery.inventory.dto.CustomerDTO;
import com.jewellery.inventory.dto.ApiResponse;
import com.jewellery.inventory.service.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        log.info("Fetching all customers");
        List<CustomerDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        try {
            log.info("Fetching customer: {}", id);
            CustomerDTO customer = customerService.getCustomer(id);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/search/{name}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<List<CustomerDTO>> searchCustomers(@PathVariable String name) {
        log.info("Searching customers: {}", name);
        List<CustomerDTO> customers = customerService.searchCustomers(name);
        return ResponseEntity.ok(customers);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> createCustomer(@RequestBody CustomerDTO dto) {
        try {
            log.info("Creating customer: {}", dto.getName());
            CustomerDTO customer = customerService.createCustomer(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(customer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        try {
            log.info("Updating customer: {}", id);
            CustomerDTO customer = customerService.updateCustomer(id, dto);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            log.info("Deleting customer: {}", id);
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(new ApiResponse(true, "Customer deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
