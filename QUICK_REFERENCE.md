# Quick Reference Guide

## 🚀 Quick Start Commands

### Database
```bash
# Create database
mysql -u root -p < database/schema.sql

# Backup database
mysqldump -u root -p jewellery_inventory > backup.sql

# Restore database
mysql -u root -p jewellery_inventory < backup.sql

# Connect to database
mysql -u root -p jewellery_inventory
```

### Backend (Spring Boot)
```bash
# Navigate to backend
cd backend

# Install dependencies
mvn clean install

# Run application (development)
mvn spring-boot:run

# Build JAR
mvn clean package

# Run JAR
java -jar target/inventory-system-1.0.0.jar

# Run tests
mvn test

# Check dependencies
mvn dependency:tree
```

### Frontend (React)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules && npm install
```

## 📋 API Testing

### Using cURL
```bash
# Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","confirmPassword":"pass123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get all products (public)
curl http://localhost:8080/api/products

# Get all customers (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/customers
```

### Using Postman
1. Import collection from API endpoints
2. Set up environment variables
3. Use `{{token}}` for authenticated requests

## 🗄️ Database Queries

### View all tables
```sql
USE jewellery_inventory;
SHOW TABLES;
```

### Check user roles
```sql
SELECT id, email, name, role FROM users;
```

### View low stock products
```sql
SELECT name, type, stock FROM products WHERE stock < 10;
```

### View recent orders
```sql
SELECT o.id, c.name, o.total_amount, o.status, o.created_at
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 10;
```

### Update rates
```sql
INSERT INTO rates (gold_rate, silver_rate, date) 
VALUES (6500, 75, CURDATE())
ON DUPLICATE KEY UPDATE 
  gold_rate = 6500, 
  silver_rate = 75;
```

### Check order items
```sql
SELECT oi.id, p.name, oi.quantity, oi.price, oi.total_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 1;
```

## 🔑 API Endpoints Cheatsheet

### Auth
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/health
```

### Products
```
GET    /api/products                    (public)
GET    /api/products/{id}               (public)
GET    /api/products/search/{name}      (public)
GET    /api/products/type/{type}        (public)
GET    /api/products/low-stock/{n}      (protected)
POST   /api/products                    (admin)
PUT    /api/products/{id}               (admin)
DELETE /api/products/{id}               (admin)
```

### Customers
```
GET    /api/customers                   (protected)
GET    /api/customers/{id}              (protected)
GET    /api/customers/search/{name}     (protected)
POST   /api/customers                   (protected)
PUT    /api/customers/{id}              (protected)
DELETE /api/customers/{id}              (admin)
```

### Orders
```
GET    /api/orders                      (protected)
GET    /api/orders/{id}                 (protected)
GET    /api/orders/customer/{id}        (protected)
POST   /api/orders                      (protected)
PUT    /api/orders/{id}/complete        (protected)
PUT    /api/orders/{id}/cancel          (protected)
```

### Rates
```
GET    /api/rates                       (public)
GET    /api/rates/{id}                  (public)
GET    /api/rates/latest                (public)
GET    /api/rates/by-date/{date}        (public)
POST   /api/rates                       (admin)
PUT    /api/rates/{id}                  (admin)
```

## 🛠️ Development Tips

### Git
```bash
# Initialize repo
git init

# Add files
git add .

# Commit
git commit -m "[FEAT] Add feature"

# Push
git push origin main

# Branches
git checkout -b feature/new-feature
git merge feature/new-feature
```

### Debugging

#### Backend
```java
// Add logging
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private Logger logger = LoggerFactory.getLogger(MyClass.class);
logger.info("User created: {}", userId);
logger.error("Error occurred: {}", e.getMessage());
```

#### Frontend
```javascript
// Console logging
console.log('Data:', data)
console.error('Error:', error)

// React DevTools browser extension
// Network tab in DevTools
// Check localStorage for token
localStorage.getItem('auth_token')
```

## 🔐 JWT Token

### Decode JWT (online)
Visit: https://jwt.io/

### Check token in localStorage
```javascript
// In browser console
console.log(localStorage.getItem('auth_token'))
```

### Token payload
```json
{
  "sub": "user@email.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234671490
}
```

## 📦 Project Commands

### Build Everything
```bash
# Build backend
cd backend && mvn clean package

# Build frontend
cd frontend && npm run build

# Both
cd backend && mvn clean package && cd ../frontend && npm run build
```

### Update Dependencies

#### Backend
```bash
cd backend
mvn versions:display-dependency-updates
mvn versions:use-latest-versions
```

#### Frontend
```bash
cd frontend
npm outdated
npm update
```

## 🚀 Production Commands

### Backend
```bash
# Create JAR
mvn clean package -DskipTests

# Run JAR
java -Dspring.profiles.active=prod \
  -Dspring.datasource.url=jdbc:mysql://prod-db:3306/jewellery \
  -Dspring.datasource.password=<password> \
  -Djwt.secret=<secret> \
  -jar target/inventory-system-1.0.0.jar
```

### Frontend
```bash
# Build
npm run build

# Serve with python
cd dist
python -m http.server 3000

# Or with node
npx serve -s dist -l 3000
```

## 📊 File Locations

| File | Location |
|------|----------|
| Application config | `backend/src/main/resources/application.properties` |
| Database schema | `database/schema.sql` |
| Frontend config | `frontend/vite.config.js` |
| API base URL | `frontend/src/utils/constants.js` |
| Auth context | `frontend/src/context/AuthContext.jsx` |
| API services | `frontend/src/services/index.js` |
| Main layout | `frontend/src/layouts/MainLayout.jsx` |

## 🎯 Environment Variables

### Backend (.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jewellery_inventory
spring.datasource.username=root
spring.datasource.password=root
jwt.secret=your-secret-key
jwt.expiration=86400000
server.port=8080
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8080/api
```

## 🐛 Troubleshooting Commands

```bash
# Check if ports are in use
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :8080
lsof -i :5173

# Kill process on port
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>

# Check MySQL
mysql --version
systemctl status mysql

# Check Node
node --version
npm --version

# Check Java
java --version
mvn --version
```

## 📝 Important Files

- Main README: `README.md`
- Backend docs: `backend/README.md`
- Frontend docs: `frontend/README.md`
- Deployment guide: `DEPLOYMENT.md`
- Contributing guide: `CONTRIBUTING.md`
- Project summary: `PROJECT_SUMMARY.md`
- Database schema: `database/schema.sql`

## 💡 Quick Tips

1. **Clear NodeJS cache**: `npm cache clean --force`
2. **Clear Docker cache**: `docker system prune`
3. **View hidden files**: `ls -la` (Linux/Mac)
4. **Extract Maven logs**: `mvn clean install | tee build.log`
5. **Test API locally**: Download Postman or Insomnia
6. **Debug JWT**: Use https://jwt.io/
7. **Check CORS**: Open browser console on CORS errors
8. **Monitor API calls**: Use Network tab in DevTools

## 🔗 Useful Links

- Spring Boot: https://spring.io/projects/spring-boot
- React: https://react.dev
- MySQL: https://dev.mysql.com/
- JWT: https://jwt.io/
- Tailwind CSS: https://tailwindcss.com/
- Vite: https://vitejs.dev/
- Maven: https://maven.apache.org/

---

**Last Updated**: April 2026  
**Quick Ref Version**: 1.0
