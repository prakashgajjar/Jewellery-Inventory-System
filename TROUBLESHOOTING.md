# Troubleshooting Guide

## Common Issues and Solutions

### Database Issues

#### Issue: "Access denied for user 'root'@'localhost'"
**Solution:**
```sql
-- Verify MySQL is running
mysql -u root -p

-- Reset password if needed (varies by OS)
-- Windows (as Administrator):
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;

-- Linux/Mac:
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
```

#### Issue: "Can't connect to MySQL server"
**Solution:**
```bash
# Check if MySQL is running
# Windows
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :3306

# Start MySQL
# Windows
net start MySQL80

# Linux
sudo systemctl start mysql

# Mac
brew services start mysql
```

#### Issue: "Database 'jewellery_inventory' doesn't exist"
**Solution:**
```bash
# Create database
mysql -u root -p < database/schema.sql

# Or manually
mysql -u root -p
CREATE DATABASE jewellery_inventory;
source database/schema.sql;
```

#### Issue: "Duplicate entry for key 'PRIMARY'"
**Solution:**
```sql
-- Reset auto_increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE rates AUTO_INCREMENT = 1;

-- Or drop and recreate tables
DROP DATABASE jewellery_inventory;
mysql -u root -p < database/schema.sql
```

---

### Backend (Spring Boot) Issues

#### Issue: Port 8080 already in use
**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

#### Issue: "Failed to configure a DataSource"
**Solution:**
1. Verify MySQL is running (see Database Issues above)
2. Check `application.properties` database URL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jewellery_inventory
spring.datasource.username=root
spring.datasource.password=root
```
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

#### Issue: "dependency tree will not be resolved"
**Solution:**
```bash
# Clear Maven cache
mvn clean
rm -rf ~/.m2/repository

# Rebuild
mvn clean install
```

#### Issue: "No qualifying bean of type found"
**Solution:**
1. Check `@Repository` annotations on repository classes
2. Verify `@Service` annotations on service classes
3. Run `mvn clean package`
4. Check classpath in IDE settings

#### Issue: JWT token invalid or expired
**Solution:**
```properties
# Increase expiration in application.properties (milliseconds)
jwt.expiration=86400000  # 24 hours

# Or verify secret key
jwt.secret=your-super-secret-key-minimum-32-characters
```

#### Issue: CORS errors in browser console
**Solution:**
1. Verify SecurityConfig.java has CORS configuration
2. Check allowed origins match frontend URL:
```java
.allowedOrigins("http://localhost:3000", "http://localhost:5173")
```
3. Clear browser cache and cookies
4. Try incognito/private window

#### Issue: "Cannot find @SpringBootApplication"
**Solution:**
```bash
# Ensure correct project structure
backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── jewellery/
                    └── inventory/
                        └── JewelleryInventoryApplication.java

# Run from project root
cd backend
mvn spring-boot:run
```

---

### Frontend (React) Issues

#### Issue: Port 5173 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5173
kill -9 <PID>

# Or specify different port
npm run dev -- --port 3001
```

#### Issue: "npm: command not found"
**Solution:**
```bash
# Install Node.js from https://nodejs.org/
node --version
npm --version

# Or use package manager
# Windows (Chocolatey)
choco install nodejs

# Linux (Ubuntu/Debian)
sudo apt-get install nodejs npm

# Mac (Homebrew)
brew install node
```

#### Issue: "Cannot find module '@vitejs/plugin-react'"
**Solution:**
```bash
cd frontend

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Module not found" errors
**Solution:**
```bash
# Install missing packages
npm install

# Missing specific package?
npm install package-name

# Verify installed packages
npm list

# Update packages
npm update
```

#### Issue: "localhost:5173 refused to connect"
**Solution:**
1. Verify dev server is running: `npm run dev`
2. Check terminal output for errors
3. Try the exact URL from terminal output (may be different IP)
4. Clear DNS cache:
```bash
# Windows (PowerShell as Admin)
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches

# Mac
sudo dscacheutil -flushcache
```

#### Issue: "401 Unauthorized" on API calls
**Solution:**
1. Login first - check token is being saved:
```javascript
// Browser console
localStorage.getItem('auth_token')
```
2. Verify token in API request headers
3. Check API returns 401 for unprotected routes
4. Verify JWT secret matches backend

#### Issue: "Cannot read property 'user' of undefined"
**Solution:**
1. Ensure AuthProvider wraps App component
2. Check useAuth hook is imported correctly
3. Verify localStorage has auth_token
4. Check AuthContext.jsx has proper initialization

#### Issue: Components not rendering
**Solution:**
```bash
# Check React DevTools
1. Install React DevTools browser extension
2. Check component hierarchy
3. Verify props being passed correctly

# Check console
console.log in components to debug
```

#### Issue: Tailwind CSS not applying
**Solution:**
```bash
# Verify tailwind.config.js paths
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",
]

# Clear cache and rebuild
npm run build

# Check index.css has Tailwind directives
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Issue: Build fails with Vite
**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

---

### Authentication Issues

#### Issue: Login fails but credentials appear correct
**Solution:**
1. Check database user exists:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```
2. Verify password encoding matches BCrypt (backend uses PasswordEncoder)
3. Check API responds with error details
4. Check network tab in DevTools for exact error

#### Issue: Token not persisting after refresh
**Solution:**
1. Verify localStorage is working:
```javascript
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test'));
localStorage.removeItem('test');
```
2. Check AuthContext initializes from localStorage
3. Verify token key matches (`auth_token`)
4. Check browser privacy settings allow localStorage

#### Issue: "Unauthorized" after token expires
**Solution:**
1. Token expiration is 24 hours by default
2. Increase expiration in application.properties:
```properties
jwt.expiration=604800000  # 7 days
```
3. Or implement refresh token mechanism

#### Issue: Cannot logout
**Solution:**
1. Check localStorage.removeItem() in AuthContext
2. Verify logout button calls correct function
3. Check console for errors
4. Verify context state updates after logout

---

### API Issues

#### Issue: 404 Not Found on API calls
**Solution:**
1. Verify correct URL in constants.js:
```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
```
2. Check endpoint exists in controller
3. Verify HTTP method (GET, POST, PUT, DELETE)
4. Test endpoint with curl:
```bash
curl http://localhost:8080/api/products
```

#### Issue: 500 Internal Server Error
**Solution:**
1. Check backend console for stack trace
2. Run backend with debug logging:
```properties
logging.level.com.jewellery.inventory=DEBUG
```
3. Check database is accessible
4. Verify all required fields in request body

#### Issue: Axios interceptor not working
**Solution:**
1. Verify interceptor setup in api.js
2. Check token is in localStorage when making request
3. Test without interceptor first:
```javascript
axios.get('/products')  // Without interceptor
api.get('/products')    // With interceptor
```

#### Issue: CORS preflight request fails
**Solution:**
1. Backend should handle OPTIONS requests
2. Verify SecurityConfig.java CORS configuration
3. Check request headers are allowed
4. Test with curl without CORS:
```bash
curl http://localhost:8080/api/products
```

---

### Development Environment Issues

#### Issue: Commands work in terminal but not in npm scripts
**Solution:**
1. Check PATH environment variables
2. Try absolute paths in npm scripts
3. Use cross-platform tools:
```json
{
  "scripts": {
    "build": "npm run clean && npm run compile && npm run bundle"
  }
}
```

#### Issue: Git merge conflicts
**Solution:**
```bash
# View conflicts
git status

# Resolve in editor, then
git add <file>
git commit -m "Resolve merge conflicts"

# Or abort
git merge --abort
```

#### Issue: Files not visible in IDE
**Solution:**
1. Refresh IDE project:
   - IntelliJ: File > Invalidate Caches > Restart
   - VS Code: Close and reopen folder
2. Check .gitignore isn't hiding files
3. Verify file encoding is UTF-8

---

### Performance Issues

#### Issue: Backend slow on startup
**Solution:**
1. Check database connection time
2. Reduce JPA/Hibernate logging:
```properties
logging.level.org.hibernate=WARN
```
3. Enable connection pooling

#### Issue: Frontend loads slowly
**Solution:**
```bash
# Analyze bundle
npm install -g webpack-bundle-analyzer
npm run build -- --analyze

# Check network tab in DevTools
# Compress images
# Lazy load routes
```

#### Issue: API requests taking too long
**Solution:**
```sql
-- Add indexes
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_product_type ON products(type);
CREATE INDEX idx_customer_phone ON customers(phone);
```

---

### Production Issues

#### Issue: ".env file not found" in production
**Solution:**
1. Set environment variables directly on server
2. Don't ship .env in production
3. Use vault/secrets manager

#### Issue: HTTPS not working
**Solution:**
1. Generate SSL certificate:
```bash
# Self-signed (dev only)
keytool -genkey -alias tomcat -keyalg RSA -keystore keystore.p12

# Production: use Let's Encrypt
```
2. Configure in application.properties:
```properties
server.ssl.key-store=keystore.p12
server.ssl.key-store-password=password
```

#### Issue: Database connection timeout in production
**Solution:**
1. Increase connection pool size
2. Configure in application.properties:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=30000
```

---

## Getting Help

1. **Check logs first**
   - Backend: Terminal output or logs/ directory
   - Frontend: Browser console (F12)
   - Database: /var/log/mysql or Event Viewer

2. **Search error message**
   - Stack Overflow: https://stackoverflow.com/
   - Official docs: Spring.io, React.dev, MySQL docs

3. **Debug systematically**
   - Isolate the issue
   - Check each component independently
   - Use debugger/breakpoints

4. **Ask for help**
   - Include full error message/stack trace
   - Describe steps to reproduce
   - Share relevant code/config

---

**Last Updated**: April 2026  
**Questions?** Check README.md or CONTRIBUTING.md
