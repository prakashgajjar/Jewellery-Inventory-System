-- Jewellery Inventory & Billing System Database Schema
-- MySQL 8.0+

-- Drop database if exists (for clean setup)
-- DROP DATABASE IF EXISTS jewellery_inventory;

-- Create database
CREATE DATABASE IF NOT EXISTS jewellery_inventory;
USE jewellery_inventory;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('RING', 'BRACELET', 'NECKLACE', 'EARRING', 'ANKLET', 'PENDANT', 'CHAIN', 'OTHER') NOT NULL,
    weight DECIMAL(10, 3) NOT NULL,
    purity INT NOT NULL,
    making_charges DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url LONGTEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_stock (stock),
    INDEX idx_name (name)
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_name (name)
);

-- Rates Table (Gold/Silver rates)
CREATE TABLE IF NOT EXISTS rates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gold_rate DECIMAL(10, 2) NOT NULL,
    silver_rate DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    gst DECIMAL(15, 2),
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    invoice_number VARCHAR(100) UNIQUE,
    invoice_pdf LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- Create Triggers for audit trail (optional)
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS users_updated_before_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS products_updated_before_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS customers_updated_before_update
BEFORE UPDATE ON customers
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS orders_updated_before_update
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS rates_updated_before_update
BEFORE UPDATE ON rates
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

DELIMITER ;

-- Sample Data (Optional - comment out if not needed)
-- INSERT INTO users (email, password, name, role) VALUES
-- ('admin@jewellery.local', '$2a$10$...', 'Admin User', 'ADMIN');

-- Sample indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_date ON orders(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_products_type_stock ON products(type, stock);
CREATE INDEX IF NOT EXISTS idx_order_items_order_product ON order_items(order_id, product_id);
