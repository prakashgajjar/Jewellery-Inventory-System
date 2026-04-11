# Jewellery Inventory - Backend Setup Guide

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Git

## Quick Start

### 1. Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema script
mysql -u root -p < database/schema.sql
```

Or execute the SQL commands directly in your MySQL client.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080/api**

### 3. Configuration

Update the database credentials in [application.properties](src/main/resources/application.properties):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jewellery_inventory
spring.datasource.username=root
spring.datasource.password=<your-password>
```

Also update the JWT secret:

```properties
jwt.secret=your-secret-key-here
```

## API Endpoints

### Authentication (`/api/auth`)

- **POST** `/auth/signup` - Register new user
- **POST** `/auth/login` - Login user
- **GET** `/auth/health` - Check auth service

### Products (`/api/products`)

- **GET** `/products` - Get all products (public)
- **GET** `/products/{id}` - Get product by ID (public)
- **GET** `/products/search/{name}` - Search products (public)
- **GET** `/products/type/{type}` - Get products by type (public)
- **GET** `/products/low-stock/{threshold}` - Get low stock products (protected)
- **POST** `/products` - Create product (ADMIN only)
- **PUT** `/products/{id}` - Update product (ADMIN only)
- **DELETE** `/products/{id}` - Delete product (ADMIN only)

### Customers (`/api/customers`)

- **GET** `/customers` - Get all customers (protected)
- **GET** `/customers/{id}` - Get customer by ID (protected)
- **GET** `/customers/search/{name}` - Search customers (protected)
- **POST** `/customers` - Create customer (protected)
- **PUT** `/customers/{id}` - Update customer (protected)
- **DELETE** `/customers/{id}` - Delete customer (ADMIN only)

### Orders (`/api/orders`)

- **GET** `/orders` - Get all orders (protected)
- **GET** `/orders/{id}` - Get order by ID (protected)
- **GET** `/orders/customer/{customerId}` - Get customer orders (protected)
- **POST** `/orders` - Create order (protected)
- **PUT** `/orders/{id}/complete` - Complete order (protected)
- **PUT** `/orders/{id}/cancel` - Cancel order (protected)

### Rates (`/api/rates`)

- **GET** `/rates` - Get all rates (public)
- **GET** `/rates/{id}` - Get rate by ID (public)
- **GET** `/rates/latest` - Get latest rates (public)
- **GET** `/rates/by-date/{date}` - Get rates by date (public)
- **POST** `/rates` - Create rate (ADMIN only)
- **PUT** `/rates/{id}` - Update rate (ADMIN only)

## Project Structure

```
backend/
├── src/main/
│   ├── java/com/jewellery/inventory/
│   │   ├── config/          # Spring configuration
│   │   ├── controller/      # REST controllers
│   │   ├── entity/          # JPA entities
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── dto/            # Data transfer objects
│   │   ├── security/       # JWT & security
│   │   ├── util/           # Utilities
│   │   └── JewelleryInventoryApplication.java
│   └── resources/
│       └── application.properties
├── pom.xml
└── README.md
```

## Key Features

✅ JWT-based authentication
✅ Role-based access control (ADMIN, STAFF)
✅ RESTful API design
✅ Input validation
✅ Error handling
✅ CORS support
✅ Database transactions
✅ Comprehensive logging

## Security

- Passwords are hashed using BCrypt
- JWT tokens expire after 24 hours (configurable)
- CORS is configured for local development
- Authentication required for protected endpoints
- Role-based authorization

## Entity Relationships

```
User (1) ──────── (M) Order
Customer (1) ──────── (M) Order
Product (M) ──────┐ (1) OrderItem (M) ──────┐ (1) Order
Rate (no relation - separate entity)
```

## Database Schema

- **users**: User authentication and profiles
- **products**: Jewellery inventory
- **customers**: Customer information
- **orders**: Order records
- **order_items**: Order line items
- **rates**: Gold and silver rates

## Troubleshooting

### Application won't start

Check if:
- MySQL service is running
- Database `jewellery_inventory` exists
- Database credentials are correct in `application.properties`
- Port 8080 is available

### JWT token errors

- Ensure `jwt.secret` is configured
- Check token expiration time in `application.properties`
- Verify Authorization header format: `Bearer <token>`

### CORS errors

CORS is configured for:
- http://localhost:3000
- http://localhost:5173

Update [SecurityConfig.java](src/main/java/com/jewellery/inventory/config/SecurityConfig.java) if needed.

## Price Calculation Formula

```
Final Price = (Weight × Gold/Silver Rate) + Making Charges + GST(18%)
```

## Testing

Run tests using:

```bash
mvn test
```

## Production Deployment

1. Update `application.properties` with production database details
2. Change `jwt.secret` to a strong, unique value
3. Disable `spring.jpa.hibernate.ddl-auto=update` (use `validate` instead)
4. Configure CORS origins for your production domain
5. Enable HTTPS/SSL
6. Use environment variables for sensitive data

## Support

For issues or questions, please check the main [README.md](../README.md)
