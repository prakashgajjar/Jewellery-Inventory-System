package com.jewellery.inventory.service;

import com.jewellery.inventory.dto.OrderDTO;
import com.jewellery.inventory.dto.OrderItemDTO;
import com.jewellery.inventory.entity.*;
import com.jewellery.inventory.repository.OrderRepository;
import com.jewellery.inventory.repository.OrderItemRepository;
import com.jewellery.inventory.repository.CustomerRepository;
import com.jewellery.inventory.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PdfInvoiceGenerator pdfInvoiceGenerator;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    private static final BigDecimal GST_RATE = new BigDecimal("0.18"); // 18% GST

    public OrderDTO createOrder(OrderDTO dto, List<OrderItemDTO> items) {
        Optional<Customer> customerOpt = customerRepository.findById(dto.getCustomerId());
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        Order order = new Order();
        order.setCustomer(customerOpt.get());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setItems(new java.util.ArrayList<>());

        BigDecimal subtotal = BigDecimal.ZERO;

        // Add items to order
        for (OrderItemDTO itemDTO : items) {
            Optional<Product> productOpt = productRepository.findById(itemDTO.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Product not found: " + itemDTO.getProductId());
            }

            Product product = productOpt.get();

            // Check stock
            if (product.getStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            // Calculate item price
            BigDecimal itemPrice = itemDTO.getPrice() != null ? itemDTO.getPrice() : product.getMakingCharges();
            BigDecimal totalPrice = itemPrice.multiply(new BigDecimal(itemDTO.getQuantity()));

            // Add to subtotal
            subtotal = subtotal.add(totalPrice);

            // Update stock
            product.setStock(product.getStock() - itemDTO.getQuantity());
            productRepository.save(product);

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemPrice);
            orderItem.setTotalPrice(totalPrice);

            order.getItems().add(orderItem);
        }

        // Calculate GST and total
        BigDecimal gst = subtotal.multiply(GST_RATE);
        BigDecimal totalAmount = subtotal.add(gst);

        order.setSubtotal(subtotal);
        order.setGst(gst);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        log.info("Order created: {} with {} items", savedOrder.getId(), items.size());

        return toDTO(savedOrder);
    }

    public OrderDTO getOrder(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return toDTO(orderOpt.get());
    }

    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO completeOrder(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setInvoiceNumber("INV-" + order.getId() + "-" + System.currentTimeMillis());
        order.setInvoicePdf(pdfInvoiceGenerator.generateInvoiceBase64(order));

        Order updatedOrder = orderRepository.save(order);
        log.info("Order completed: {}", id);

        return toDTO(updatedOrder);
    }

    public String getOrderInvoiceBase64(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty() || orderOpt.get().getInvoicePdf() == null) {
            throw new RuntimeException("Invoice not found");
        }
        return orderOpt.get().getInvoicePdf();
    }

    public OrderDTO cancelOrder(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();

        // Restore stock for cancelled order
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        log.info("Order cancelled: {}", id);

        return toDTO(updatedOrder);
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getName());
        dto.setSubtotal(order.getSubtotal());
        dto.setGst(order.getGst());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().toString());
        dto.setInvoiceNumber(order.getInvoiceNumber());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(order.getItems().stream()
                .map(this::itemToDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    private OrderItemDTO itemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setTotalPrice(item.getTotalPrice());
        return dto;
    }
}
