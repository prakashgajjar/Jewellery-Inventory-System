package com.jewellery.inventory.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.UnitValue;
import com.jewellery.inventory.entity.Order;
import com.jewellery.inventory.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class PdfInvoiceGenerator {

    public String generateInvoiceBase64(Order order) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header
            document.add(new Paragraph("Jewellery System Invoice").setBold().setFontSize(20));
            document.add(new Paragraph("Invoice Number: " + order.getInvoiceNumber()));
            document.add(new Paragraph("Date: " + order.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));
            document.add(new Paragraph("Customer: " + order.getCustomer().getName() + " (" + order.getCustomer().getPhone() + ")"));
            document.add(new Paragraph("\n"));

            // Items Table
            Table table = new Table(UnitValue.createPercentArray(new float[]{40, 20, 20, 20})).useAllAvailableWidth();
            table.addHeaderCell(new Cell().add(new Paragraph("Product").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Quantity").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Price/Unit").setBold()));
            table.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()));

            for (OrderItem item : order.getItems()) {
                table.addCell(new Paragraph(item.getProduct().getName()));
                table.addCell(new Paragraph(String.valueOf(item.getQuantity())));
                table.addCell(new Paragraph("Rs." + item.getPrice().toString()));
                table.addCell(new Paragraph("Rs." + item.getTotalPrice().toString()));
            }
            document.add(table);
            document.add(new Paragraph("\n"));

            // Summary
            document.add(new Paragraph("Subtotal: Rs." + order.getSubtotal().toString()));
            document.add(new Paragraph("GST (18%): Rs." + order.getGst().toString()));
            document.add(new Paragraph("Total Amount: Rs." + order.getTotalAmount().toString()).setBold().setFontSize(14));

            document.close();
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF Invoice", e);
        }
    }
}
