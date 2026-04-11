# Jewellery Inventory & Billing System - Deployment Guide

## Local Development Setup

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+
- Git

### Step 1: Database Setup

```bash
# Start MySQL and create the database
mysql -u root -p < database/schema.sql
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080/api`

### Step 3: Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Step 4: Access the Application

1. Open browser and go to `http://localhost:5173`
2. Sign up with email and password
3. Login to access the dashboard

## Production Deployment

### Backend (Spring Boot)

#### Docker Deployment

```dockerfile
FROM openjdk:17-slim
COPY target/inventory-system-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
```

Build and run:
```bash
mvn clean package
docker build -t jewellery-backend:latest .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/jewellery_inventory \
  -e SPRING_DATASOURCE_PASSWORD=<password> \
  -e JWT_SECRET=<production-secret> \
  jewellery-backend:latest
```

#### AWS/Cloud Deployment

1. Push JAR to cloud provider
2. Configure environment variables
3. Set up RDS database
4. Configure security groups/firewall

### Frontend (React/Vite)

#### Build for Production

```bash
cd frontend
npm run build  # Creates dist/ folder
```

#### Deployment Options

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: AWS S3 + CloudFront**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

### Database Setup (Production)

1. Use managed database (AWS RDS, Google Cloud SQL, Azure Database)
2. Ensure proper backups are configured
3. Enable encryption at rest
4. Use VPC/Private subnets
5. Set up read replicas if needed

## Environment Configuration

### Backend (application.properties)

```properties
# Production Database
spring.datasource.url=jdbc:mysql://prod-db-host:3306/jewellery_inventory
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Logging
logging.level.root=WARN
logging.level.com.jewellery.inventory=INFO

# Hibernate
spring.jpa.hibernate.ddl-auto=validate
```

### Frontend (.env.production)

```
VITE_API_URL=https://api.yourdomain.com/api
```

## Monitoring & Logging

### Backend Logging Setup

```properties
# Add to application.properties
logging.file.name=logs/application.log
spring.devtools.livereload.enabled=false
```

### Frontend Error Tracking

Integrate Sentry or similar:
```javascript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
})
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain only
- [ ] Set strong database passwords
- [ ] Enable WAF (Web Application Firewall)
- [ ] Regular security updates
- [ ] Database backups scheduled
- [ ] API rate limiting configured
- [ ] Sensitive data not logged
- [ ] OWASP compliance verified

## Performance Optimization

### Backend
- Enable query result caching
- Use database indexes
- Implement connection pooling
- Enable gzip compression
- Use CDN for static files

### Frontend  
- Lazy load routes
- Implement code splitting
- Minify and compress assets
- Use service workers for offline support
- Optimize images

## Scaling

### Horizontal Scaling

**Backend (Multiple Instances)**
```
- Load Balancer (Nginx/HAProxy)
- Multiple Spring Boot instances
- Shared MySQL database or read replicas
- Redis for session management
```

**Frontend**
- Use CDN for static assets
- Multiple edge locations globally
- Cache static content

### Vertical Scaling

- Increase server RAM/CPU
- Upgrade database hardware
- Increase database connection pool

## Backup & Recovery

### Daily Backups

```bash
# MySQL backup script
mysqldump -u root -p jewellery_inventory > backup_$(date +%Y%m%d).sql

# Store in S3
aws s3 cp backup_*.sql s3://backup-bucket/
```

### Recovery

```bash
mysql -u root -p jewellery_inventory < backup_20240115.sql
```

## Disaster Recovery Plan

1. **RTO (Recovery Time Objective)**: 2 hours
2. **RPO (Recovery Point Objective)**: 1 hour
3. **Backup Strategy**: Daily full backup + hourly incremental
4. **Backup Location**: Geographic redundancy (multiple regions)
5. **Testing**: Monthly disaster recovery drills

## Monitoring Alerts

Set up alerts for:
- API response time > 5s
- Error rate > 1%
- Database connection pool exhaustion
- Disk space < 10%
- Memory usage > 80%
- Request timeout
- Failed database connections

## Support & Maintenance

### Regular Maintenance

- Monthly security updates
- Quarterly dependency updates
- Reviews of error logs
- Performance analysis
- Database optimization

### Handover Documentation

- API documentation
- Database schema diagram
- Deployment procedures
- Troubleshooting guide
- Emergency contacts

## Cost Optimization

- Use auto-scaling for traffic spikes
- Reserved instances for baseline load
- Database query optimization
- CDN usage monitoring
- Regular cost audits

## Further Reading

- Spring Boot Production Guide: https://spring.io/blog/2021/01/12/spring-boot-application-properties-changed-in-2-4
- React Performance: https://reactjs.org/docs/optimizing-performance.html
- MySQL Best Practices: https://dev.mysql.com/doc/
- Security Best Practices: https://owasp.org/

---

For more information, see the project [README.md](./README.md)
