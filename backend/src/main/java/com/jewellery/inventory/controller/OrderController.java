package com.jewellery.inventory.controller;

import com.jewellery.inventory.dto.OrderDTO;
import com.jewellery.inventory.dto.OrderItemDTO;
import com.jewellery.inventory.dto.ApiResponse;
import com.jewellery.inventory.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        log.info("Fetching all orders");
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        try {
            log.info("Fetching order: {}", id);
            OrderDTO order = orderService.getOrder(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomer(@PathVariable Long customerId) {
        log.info("Fetching orders for customer: {}", customerId);
        List<OrderDTO> orders = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setCustomerId(((Number) payload.get("customerId")).longValue());

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) payload.get("items");
            List<OrderItemDTO> items = itemsData.stream()
                    .map(item -> new OrderItemDTO(
                            null,
                            ((Number) item.get("productId")).longValue(),
                            (String) item.get("productName"),
                            ((Number) item.get("quantity")).intValue(),
                            new java.math.BigDecimal(item.get("price").toString()),
                            null
                    ))
                    .toList();

            log.info("Creating order for customer: {}", orderDTO.getCustomerId());
            OrderDTO order = orderService.createOrder(orderDTO, items);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            log.error("Error creating order: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> completeOrder(@PathVariable Long id) {
        try {
            log.info("Completing order: {}", id);
            OrderDTO order = orderService.completeOrder(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            log.info("Cancelling order: {}", id);
            OrderDTO order = orderService.cancelOrder(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
