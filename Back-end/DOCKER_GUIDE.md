# 🐳 Docker Setup Guide - Dating Software Backend

## 📋 Tổng quan

Docker Compose setup này bao gồm:
- **PostgreSQL 15**: Database chính
- **Redis 7**: Cache và session storage
- **pgAdmin 4**: Quản lý database
- **Backend API**: Node.js application
- **MailHog**: Email testing tool

## 🚀 Cách sử dụng

### 1. Khởi động toàn bộ hệ thống
```bash
# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Khởi động với rebuild
docker-compose up -d --build
```

### 2. Khởi động từng service riêng lẻ
```bash
# Chỉ khởi động database
docker-compose up -d postgres redis

# Khởi động backend sau khi database sẵn sàng
docker-compose up -d backend

# Khởi động pgAdmin
docker-compose up -d pgadmin
```

### 3. Dừng hệ thống
```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (cẩn thận - sẽ mất data)
docker-compose down -v

# Dừng và xóa images
docker-compose down --rmi all
```

## 🔧 Truy cập các services

### Backend API
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api/docs

### PostgreSQL Database
- **Host**: localhost
- **Port**: 5432
- **Database**: dating_software
- **Username**: postgres
- **Password**: dating_password_2024

### pgAdmin (Database Management)
- **URL**: http://localhost:5050
- **Email**: admin@datingapp.com
- **Password**: admin123
- **Server**: Dating Software Database (auto-configured)

### Redis Cache
- **Host**: localhost
- **Port**: 6379
- **Password**: (none)

### MailHog (Email Testing)
- **SMTP**: localhost:1025
- **Web UI**: http://localhost:8025

## 📁 Volumes và Data Persistence

### Database Data
```bash
# Backup database
docker exec dating_postgres pg_dump -U postgres dating_software > backup.sql

# Restore database
docker exec -i dating_postgres psql -U postgres dating_software < backup.sql
```

### Upload Files
- **Local Path**: `./uploads/`
- **Container Path**: `/app/uploads/`

### Logs
- **Local Path**: `./logs/`
- **Container Path**: `/app/logs/`

## 🔍 Monitoring và Debugging

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Service cụ thể
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# Xem logs của container cụ thể
docker logs dating_backend
```

### Health Checks
```bash
# Kiểm tra trạng thái services
docker-compose ps

# Kiểm tra health của container
docker inspect dating_backend | grep Health -A 10
```

### Truy cập container
```bash
# Truy cập backend container
docker exec -it dating_backend sh

# Truy cập database
docker exec -it dating_postgres psql -U postgres -d dating_software

# Truy cập Redis CLI
docker exec -it dating_redis redis-cli
```

## 🛠️ Development Commands

### Chạy migrations
```bash
# Chạy migrations trong container
docker exec dating_backend npm run migrate

# Chạy seed data
docker exec dating_backend npm run seed
```

### Restart services
```bash
# Restart backend
docker-compose restart backend

# Restart database
docker-compose restart postgres

# Restart tất cả
docker-compose restart
```

### Rebuild services
```bash
# Rebuild backend
docker-compose build backend

# Rebuild và restart
docker-compose up -d --build backend
```

## 🔒 Security Notes

### Production Deployment
1. **Thay đổi passwords** trong `docker-compose.yml`
2. **Sử dụng secrets** thay vì environment variables
3. **Enable SSL** cho database connections
4. **Restrict network access** với firewall rules

### Environment Variables
```bash
# Tạo file .env cho production
cp env.example .env

# Chỉnh sửa các giá trị sensitive
nano .env
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port conflicts
```bash
# Kiểm tra ports đang sử dụng
netstat -tulpn | grep :5000
netstat -tulpn | grep :5432

# Thay đổi ports trong docker-compose.yml nếu cần
```

#### 2. Database connection issues
```bash
# Kiểm tra database status
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### 3. Backend startup issues
```bash
# Kiểm tra logs
docker-compose logs backend

# Rebuild backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

#### 4. Memory issues
```bash
# Kiểm tra resource usage
docker stats

# Tăng memory limits trong docker-compose.yml
```

### Performance Optimization

#### 1. Database tuning
```sql
-- Trong pgAdmin, chạy các queries tối ưu
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

#### 2. Redis optimization
```bash
# Kiểm tra Redis memory usage
docker exec dating_redis redis-cli info memory
```

## 📚 Useful Commands

### Database Management
```bash
# Backup
docker exec dating_postgres pg_dump -U postgres dating_software > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker exec -i dating_postgres psql -U postgres dating_software < backup.sql

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### Log Management
```bash
# Xóa logs cũ
docker system prune -f

# Xem disk usage
docker system df
```

### Network Management
```bash
# Kiểm tra networks
docker network ls

# Inspect network
docker network inspect dating_software_dating_network
```

## 🎯 Next Steps

1. **Setup Frontend**: Tạo Docker setup cho frontend
2. **CI/CD Pipeline**: Tích hợp với GitHub Actions
3. **Monitoring**: Thêm Prometheus và Grafana
4. **Load Balancing**: Setup Nginx reverse proxy
5. **SSL/TLS**: Cấu hình HTTPS cho production

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Docker và Docker Compose versions
2. System resources (CPU, Memory, Disk)
3. Network connectivity
4. Logs của các services
