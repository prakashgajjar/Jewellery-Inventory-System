# Smart Jewellery Inventory & Billing System

A full-stack web application for jewellery shop management with inventory tracking, billing, customer management, and dynamic pricing. Built with Spring Boot, React, and MySQL.

![Status](https://img.shields.io/badge/Status-Active%20Development-blue)
![Java](https://img.shields.io/badge/Java-17%2B-orange)
![React](https://img.shields.io/badge/React-18%2B-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-blue)
![License](https://img.shields.io/badge/License-Private-red)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [UI/UX Design](#-uiux-design)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)

## 🎯 Features

### Core Features
✅ Inventory Management with stock tracking  
✅ Order & Billing System with invoice generation  
✅ Customer Management with purchase history  
✅ Dynamic Pricing (Gold/Silver Rates)  
✅ Reports & Analytics Dashboard  
✅ JWT Authentication with token refresh  
✅ Role-Based Access Control (Admin, Staff)  
✅ Dashboard with real-time statistics  

### Additional Features
📷 Image Upload for Products  
🔔 Low Stock Alerts  
📥 Export Reports (PDF/Excel)  
📊 Interactive Charts & Analytics  
🔐 Password Hashing with BCrypt  
📱 Responsive Mobile Design  

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.2+ with Vite
- **Styling**: Tailwind CSS 3.3+
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Framework**: Spring Boot 3.2
- **Security**: Spring Security + JWT
- **Server**: Apache Tomcat (embedded)
- **Database ORM**: JPA (Hibernate)
- **Build Tool**: Maven 3.8+
- **Language**: Java 17+
- **PDF Generation**: iText
- **Excel Export**: Apache POI

### Database
- **DBMS**: MySQL 8.0+
- **Backup**: SQL dumps
- **Indexing**: Optimized for performance

## 📁 Project Structure

```
jewwllery-inventory/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/jewellery/inventory/
│   │   ├── config/                  # Spring configuration (Security, Cors)
│   │   ├── controller/              # REST API endpoints
│   │   ├── entity/                  # JPA entities (User, Product, etc.)
│   │   ├── service/                 # Business logic layer
│   │   ├── repository/              # Data access layer
│   │   ├── dto/                     # Data transfer objects
│   │   ├── security/                # JWT & authentication
│   │   ├── util/                    # Utility classes
│   │   └── JewelleryInventoryApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml                      # Maven configuration
│   ├── .gitignore
│   └── README.md
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   ├── components/              # Reusable components
│   │   ├── layouts/                 # Layout components
│   │   ├── services/                # API service layer
│   │   ├── context/                 # React context (Auth)
│   │   ├── utils/                   # Utility functions
│   │   ├── styles/                  # CSS & Tailwind
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .gitignore
│   └── README.md
│
├── database/
│   ├── schema.sql                   # Complete database schema
│   └── migrations/                  # Future migration files
│
├── docs/                            # Documentation
│   ├── API_ENDPOINTS.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
│
├── DEPLOYMENT.md                    # Deployment guide
├── CONTRIBUTING.md                  # Contributing guidelines
└── README.md                         # This file
```

## 👥 User Roles

### Admin
- Full system access
- Manage users and roles
- Update gold/silver rates
- View all reports
- System settings

### Staff
- Access inventory management
- Process orders and billing
- Manage customers
- View own transactions

## 📊 Database Schema

### Core Tables

**users** - User authentication & profiles
- id, email (unique), password, name, role, created_at, updated_at

**products** - Jewellery inventory
- id, name, type, weight, purity, making_charges, stock, image_url, description, created_at, updated_at

**customers** - Customer information
- id, name, phone (unique), email, address, city, state, pincode, created_at, updated_at

**orders** - Order records
- id, customer_id (FK), subtotal, gst, total_amount, status, invoice_number, invoice_pdf, created_at, updated_at

**order_items** - Order line items
- id, order_id (FK), product_id (FK), quantity, price, total_price

**rates** - Gold/Silver rates
- id, gold_rate, silver_rate, date (unique), created_at, updated_at

## 🚀 Quick Start

### Prerequisites
- Java 17+ ([Download](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html))
- Node.js 18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- Maven 3.8+ ([Download](https://maven.apache.org/))
- Git
- VS Code or similar IDE

### Step-by-Step Setup

#### 1. Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema
mysql -u root -p < database/schema.sql

# Verify
mysql -u root -p -e "USE jewellery_inventory; SHOW TABLES;"
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install

# Update database credentials in application.properties if needed
# Update JWT secret in application.properties

# Run the application
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080/api`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

#### 4. Access the Application

1. Open **http://localhost:5173** in your browser
2. Click "Sign Up" to create an account (first user can be ADMIN)
3. Login with your credentials
4. Start using the system!

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/health` - Check service health

### Product Endpoints
- `GET /api/products` - Get all products (public)
- `GET /api/products/{id}` - Get product details
- `GET /api/products/search/{name}` - Search products
- `GET /api/products/type/{type}` - Get products by type
- `GET /api/products/low-stock/{threshold}` - Get low stock alerts (protected)
- `POST /api/products` - Create product (ADMIN)
- `PUT /api/products/{id}` - Update product (ADMIN)
- `DELETE /api/products/{id}` - Delete product (ADMIN)

### Customer Endpoints
- `GET /api/customers` - Get all customers (protected)
- `GET /api/customers/{id}` - Get customer details
- `GET /api/customers/search/{name}` - Search customers
- `POST /api/customers` - Create customer (protected)
- `PUT /api/customers/{id}` - Update customer (protected)
- `DELETE /api/customers/{id}` - Delete customer (ADMIN)

### Order Endpoints
- `GET /api/orders` - Get all orders (protected)
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/customer/{id}` - Get customer orders
- `POST /api/orders` - Create order (protected)
- `PUT /api/orders/{id}/complete` - Complete order (protected)
- `PUT /api/orders/{id}/cancel` - Cancel order (protected)

### Rate Endpoints
- `GET /api/rates` - Get all rates (public)
- `GET /api/rates/{id}` - Get rate by ID
- `GET /api/rates/latest` - Get current rates (public)
- `POST /api/rates` - Create/update rate (ADMIN)

Full API documentation: See [backend README](./backend/README.md)

## 💰 Pricing Formula

```
Final Price = (Weight × Metal Rate) + Making Charges + GST(18%)
```

## 📱 UI/UX Design

### Color Scheme
- **Primary**: #FFFFFF (white background)
- **Secondary**: #F5F5F5, #E0E0E0 (light grays)
- **Accent**: #6B7280 (cool gray for elements)
- **Text**: #111827 (dark gray/black)

### Design Style
- Minimal, clean dashboard
- Soft shadows (0 1px 3px rgba(0, 0, 0, 0.1))
- Rounded corners (8px–12px)
- Card-based layout
- Responsive sidebar navigation
- Smooth hover and transition effects

### Key Pages
- 🔐 **Auth Pages**: Login & Sign Up with centered card UI
- 📊 **Dashboard**: Statistics cards, charts, recent transactions
- 📦 **Inventory**: Product table with sorting/filtering, add/edit modal
- 👤 **Customers**: Customer list, add/edit form, purchase history
- 🧾 **Billing**: Dynamic item selection, auto price calculation, invoice generation
- 📋 **Orders**: Order history, status tracking, invoice download
- 📈 **Reports**: Sales analytics, profit reports, stock alerts
- ⚙️ **Settings**: Rate updates, system configuration

## 🔐 Security

- **Passwords**: Hashed with BCrypt (strength 10)
- **Authentication**: JWT with 24-hour expiration
- **Authorization**: Role-based access control
- **CORS**: Configured for local development
- **Input Validation**: All endpoints validate input
- **Prepared Statements**: All database queries use parameterized queries
- **Rate Limiting**: Can be implemented per endpoint
- **HTTPS**: Should be enabled in production

## 📦 Dependencies

### Backend
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- MySQL Connector Java 8.0.33
- JWT (JJWT) 0.12.3
- Lombok
- iText (PDF)
- Apache POI (Excel)

### Frontend
- React 18.2
- React Router 6.20
- Axios 1.6
- Recharts 2.10
- Tailwind CSS 3.3
- Lucide React icons
- Vite 5.0

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Production environment setup
- Docker containerization
- Cloud deployment (AWS, Heroku, etc.)
- Database configuration
- Environment variables
- Performance optimization
- Monitoring setup
- Backup & recovery

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Testing requirements
- Commit message format
- Issue reporting

Steps:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m '[FEAT] Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 💡 Common Tasks

### Run Tests
```bash
# Backend
cd backend && mvn test

# Frontend
cd frontend && npm test
```

### Build for Production
```bash
# Backend
cd backend && mvn clean package

# Frontend
cd frontend && npm run build
```

### Database Migration
```bash
# Backup
mysqldump -u root -p jewellery_inventory > backup.sql

# Restore
mysql -u root -p jewellery_inventory < backup.sql
```

## 📚 Documentation

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [API Endpoints Documentation](./backend/README.md#api-endpoints)

## 🐛 Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change port in `application.properties`
- **Database connection fails**: Check MySQL is running, verify credentials
- **JWT errors**: Update JWT secret, check token format
- **CORS errors**: Update allowed origins in SecurityConfig.java

### Frontend Issues
- **API connection fails**: Verify backend is running on 8080
- **Build errors**: Clear node_modules and npm cache: `rm -rf node_modules && npm cache clean --force`
- **Page not loading**: Check browser console for errors, verify API URLs

### General Help
- Check logs folder
- Review error messages in browser console
- Verify all prerequisites are installed
- Restart services if needed

## 📊 Statistics

- **Backend**: ~2000+ lines of Java code
- **Frontend**: ~1500+ lines of React/JSX
- **Database**: 6 tables with optimized indexes
- **API Endpoints**: 30+ RESTful endpoints
- **Components**: 10+ reusable React components
- **Pages**: 8 main pages
- **Development Time Estimate**: 40-60 hours

## 🎓 Learning Resources

- [Spring Boot Official Docs](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MySQL Tutorial](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## 🔄 Version History

### v1.0.0 (Current - April 2026)
- Initial project setup
- Core functionality implemented
- Frontend & Backend scaffolding
- Database schema created
- JWT authentication system
- Basic UI/UX implementation

### Future Versions
- v1.1.0: Advanced reporting features
- v1.2.0: Mobile app (React Native)
- v1.3.0: Real-time updates (WebSocket)
- v2.0.0: Multi-location support

## 📞 Support

- **Documentation**: Check [README files](.) in each directory
- **Issues**: Create GitHub issues for bugs and feature requests
- **Questions**: Open GitHub discussions
- **Email**: [Your email here]

## 📄 License

This project is **PRIVATE** - All Rights Reserved. Unauthorized copying or distribution is prohibited.

## 👏 Acknowledgments

- Designed for jewellery retail businesses
- Built with modern tech stack
- Following industry best practices
- Optimized for performance and scalability

---

**Last Updated**: April 2026  
**Status**: Active Development  
**Maintainer**: Your Name
