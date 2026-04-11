package com.jewellery.inventory.service;

import com.jewellery.inventory.entity.Order;
import com.jewellery.inventory.entity.Product;
import com.jewellery.inventory.repository.OrderRepository;
import com.jewellery.inventory.repository.ProductRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = orders.size();
        
        long lowStockCount = products.stream()
                .filter(p -> p.getStock() < 10) 
                .count();

        long completedOrders = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED).count();

        BigDecimal avgOrderValue = completedOrders > 0 
                ? totalRevenue.divide(new BigDecimal(completedOrders), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", totalOrders);
        stats.put("avgOrderValue", avgOrderValue);
        stats.put("lowStockItems", lowStockCount);

        // Chart Data Calculation
        // Initialize 12 months
        Map<String, Map<String, Number>> monthlyData = new LinkedHashMap<>();
        for (int i = 1; i <= 12; i++) {
            String monthName = Month.of(i).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            Map<String, Number> map = new HashMap<>();
            map.put("sales", 0);
            map.put("orders", 0);
            monthlyData.put(monthName, map);
        }

        for (Order o : orders) {
            String m = o.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            Map<String, Number> map = monthlyData.get(m);
            if (map != null) {
                map.put("orders", map.get("orders").intValue() + 1);
                if (o.getStatus() == Order.OrderStatus.COMPLETED) {
                    map.put("sales", map.get("sales").doubleValue() + o.getTotalAmount().doubleValue());
                }
            }
        }

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map.Entry<String, Map<String, Number>> entry : monthlyData.entrySet()) {
            Map<String, Object> node = new HashMap<>();
            node.put("month", entry.getKey());
            node.put("sales", entry.getValue().get("sales"));
            node.put("orders", entry.getValue().get("orders"));
            chartData.add(node);
        }

        stats.put("chartData", chartData);
        return stats;
    }

    public byte[] generateExcelReport() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            // Orders Sheet
            Sheet sheet = workbook.createSheet("Orders Dashboard");
            String[] headers = {"Order ID", "Customer Name", "Total Amount Base", "GST", "Total Amount Final", "Status", "Date"};
            
            // Header styling
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            List<Order> orders = orderRepository.findAll();
            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getCustomer().getName() != null ? order.getCustomer().getName() : "N/A");
                row.createCell(2).setCellValue(order.getSubtotal().doubleValue());
                row.createCell(3).setCellValue(order.getGst().doubleValue());
                row.createCell(4).setCellValue(order.getTotalAmount().doubleValue());
                row.createCell(5).setCellValue(order.getStatus().name());
                row.createCell(6).setCellValue(order.getCreatedAt().toString());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel file", e);
        }
    }
}
