# 📊 Database Migration Guide - Dating Software

## 📋 Tổng quan

Hướng dẫn này mô tả cách gộp file migration mới vào database schema hiện có một cách an toàn và chuyên nghiệp.

## 🔄 Các thay đổi chính

### 1. **Enhanced Messages Table**
- ✅ Thêm `message_type` (text, image, video, file, audio)
- ✅ Thêm `deleted_at` cho soft delete
- ✅ Thêm `is_pinned` và `pinned_at` cho tin nhắn ghim
- ✅ Thêm các constraints và foreign keys rõ ràng

### 2. **New Message Reactions Table**
- ✅ Bảng `message_reactions` cho emoji reactions
- ✅ Hỗ trợ 6 loại reaction: like, love, laugh, wow, sad, angry
- ✅ Unique constraint để tránh duplicate reactions

### 3. **Enhanced Profiles Table**
- ✅ Thêm `message_count` để theo dõi số tin nhắn đã gửi

### 4. **Advanced Indexes**
- ✅ Indexes cho unread messages
- ✅ Indexes cho pinned messages
- ✅ Full-text search index cho nội dung tin nhắn
- ✅ Indexes cho message reactions

### 5. **Automated Triggers & Functions**
- ✅ Auto-update `message_count` khi thêm/xóa tin nhắn
- ✅ Soft delete handling
- ✅ Message statistics tracking

### 6. **Views for Analytics**
- ✅ `message_statistics` view cho báo cáo

## 🚀 Cách triển khai

### Phương pháp 1: Fresh Installation (Khuyến nghị cho môi trường mới)

```bash
# 1. Backup database hiện tại (nếu có)
pg_dump -U postgres dating_software > backup_before_migration.sql

# 2. Drop và recreate database
dropdb -U postgres dating_software
createdb -U postgres dating_software

# 3. Chạy schema mới
psql -U postgres -d dating_software -f DatingSoftware.sql
```

### Phương pháp 2: Migration Script (Khuyến nghị cho production)

```bash
# 1. Backup database
pg_dump -U postgres dating_software > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Chạy migration script
psql -U postgres -d dating_software -f database/migrations/002_enhance_messages_system.sql

# 3. Verify migration
psql -U postgres -d dating_software -c "SELECT 'Migration completed successfully!' as status;"
```

### Phương pháp 3: Docker Environment

```bash
# 1. Vào container database
docker exec -it dating_postgres psql -U postgres -d dating_software

# 2. Chạy migration trong container
\i /docker-entrypoint-initdb.d/002_enhance_messages_system.sql

# 3. Hoặc từ host
docker exec -i dating_postgres psql -U postgres -d dating_software < database/migrations/002_enhance_messages_system.sql
```

## 🔍 Verification Steps

### 1. Kiểm tra cấu trúc bảng

```sql
-- Kiểm tra bảng messages
\d messages

-- Kiểm tra bảng message_reactions
\d message_reactions

-- Kiểm tra bảng profiles
\d profiles
```

### 2. Kiểm tra indexes

```sql
-- Liệt kê tất cả indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('messages', 'message_reactions', 'profiles')
ORDER BY tablename, indexname;
```

### 3. Kiểm tra triggers

```sql
-- Liệt kê triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('messages', 'profiles')
ORDER BY event_object_table, trigger_name;
```

### 4. Kiểm tra functions

```sql
-- Liệt kê functions
SELECT 
    proname,
    prosrc
FROM pg_proc
WHERE proname IN ('update_message_stats', 'soft_delete_message')
ORDER BY proname;
```

### 5. Kiểm tra views

```sql
-- Kiểm tra view message_statistics
SELECT * FROM message_statistics LIMIT 5;
```

## 📊 Testing New Features

### 1. Test Message Types

```sql
-- Thêm tin nhắn với các loại khác nhau
INSERT INTO messages (match_id, sender_id, content, message_type) VALUES
(1, 1, 'Hello!', 'text'),
(1, 2, 'https://example.com/image.jpg', 'image'),
(1, 1, 'https://example.com/video.mp4', 'video');

-- Kiểm tra
SELECT message_type, COUNT(*) FROM messages GROUP BY message_type;
```

### 2. Test Message Reactions

```sql
-- Thêm reactions
INSERT INTO message_reactions (message_id, user_id, reaction_type) VALUES
(1, 2, 'like'),
(1, 3, 'love'),
(2, 1, 'wow');

-- Kiểm tra
SELECT reaction_type, COUNT(*) FROM message_reactions GROUP BY reaction_type;
```

### 3. Test Soft Delete

```sql
-- Soft delete một tin nhắn
UPDATE messages SET deleted_at = NOW() WHERE id = 1;

-- Kiểm tra tin nhắn đã bị soft delete
SELECT * FROM messages WHERE deleted_at IS NOT NULL;
```

### 4. Test Message Pinning

```sql
-- Ghim một tin nhắn
UPDATE messages SET is_pinned = TRUE, pinned_at = NOW() WHERE id = 2;

-- Kiểm tra tin nhắn đã ghim
SELECT * FROM messages WHERE is_pinned = TRUE;
```

### 5. Test Message Count

```sql
-- Kiểm tra message_count trong profiles
SELECT user_id, message_count FROM profiles WHERE message_count > 0;
```

## 🔧 Rollback Plan

### Nếu cần rollback migration:

```sql
-- 1. Backup dữ liệu hiện tại
CREATE TABLE messages_backup_rollback AS SELECT * FROM messages;
CREATE TABLE message_reactions_backup_rollback AS SELECT * FROM message_reactions;

-- 2. Drop các cột mới
ALTER TABLE messages DROP COLUMN IF EXISTS message_type;
ALTER TABLE messages DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE messages DROP COLUMN IF EXISTS is_pinned;
ALTER TABLE messages DROP COLUMN IF EXISTS pinned_at;

-- 3. Drop bảng reactions
DROP TABLE IF EXISTS message_reactions CASCADE;

-- 4. Drop cột message_count
ALTER TABLE profiles DROP COLUMN IF EXISTS message_count;

-- 5. Drop triggers và functions
DROP TRIGGER IF EXISTS trigger_update_message_stats ON messages;
DROP TRIGGER IF EXISTS trigger_soft_delete_message ON messages;
DROP FUNCTION IF EXISTS update_message_stats();
DROP FUNCTION IF EXISTS soft_delete_message();

-- 6. Drop indexes mới
DROP INDEX IF EXISTS idx_messages_sender;
DROP INDEX IF EXISTS idx_messages_unread;
DROP INDEX IF EXISTS idx_messages_pinned;
DROP INDEX IF EXISTS idx_messages_type;
DROP INDEX IF EXISTS idx_messages_deleted;
DROP INDEX IF EXISTS idx_messages_content_search;

-- 7. Drop view
DROP VIEW IF EXISTS message_statistics;
```

## 📈 Performance Considerations

### 1. Index Maintenance

```sql
-- Rebuild indexes sau migration
REINDEX TABLE messages;
REINDEX TABLE message_reactions;
REINDEX TABLE profiles;
```

### 2. Statistics Update

```sql
-- Cập nhật statistics
ANALYZE messages;
ANALYZE message_reactions;
ANALYZE profiles;
```

### 3. Vacuum Database

```sql
-- Cleanup sau migration
VACUUM ANALYZE;
```

## 🚨 Important Notes

### 1. **Backup Always**
- Luôn backup database trước khi migration
- Test migration trên staging environment trước
- Có rollback plan sẵn sàng

### 2. **Downtime Considerations**
- Migration có thể mất 5-10 phút tùy vào lượng dữ liệu
- Thông báo users về maintenance window
- Schedule migration vào off-peak hours

### 3. **Data Integrity**
- Migration script sử dụng transactions
- Có verification steps để đảm bảo tính toàn vẹn
- Backup data được tạo tự động

### 4. **Application Compatibility**
- Cập nhật backend code để sử dụng features mới
- Test API endpoints với new message types
- Update frontend để hiển thị reactions

## 📞 Support

Nếu gặp vấn đề trong quá trình migration:

1. **Check logs**: Xem PostgreSQL logs để debug
2. **Verify backup**: Đảm bảo backup đã được tạo thành công
3. **Test rollback**: Thực hành rollback trên test environment
4. **Contact team**: Liên hệ team development để hỗ trợ

## 🎯 Next Steps

Sau khi migration thành công:

1. **Update API**: Cập nhật backend để sử dụng features mới
2. **Frontend Integration**: Tích hợp reactions và message types vào UI
3. **Testing**: Test toàn bộ messaging flow
4. **Monitoring**: Setup monitoring cho performance
5. **Documentation**: Cập nhật API documentation
