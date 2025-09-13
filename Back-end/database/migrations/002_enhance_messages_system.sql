-- =================================================================
-- MIGRATION: Enhance Messages System
-- Date: 2024-01-15
-- Description: Add enhanced messaging features to existing database
-- Version: 2.0
-- =================================================================

-- Bắt đầu transaction để đảm bảo tính toàn vẹn
BEGIN;

-- =================================================================
-- BƯỚC 1: BACKUP DỮ LIỆU HIỆN CÓ
-- =================================================================

-- Tạo bảng backup cho messages hiện có
CREATE TABLE messages_backup AS SELECT * FROM messages;

-- =================================================================
-- BƯỚC 2: THÊM CÁC CỘT MỚI VÀO BẢNG PROFILES
-- =================================================================

-- Thêm cột message_count vào bảng profiles nếu chưa có
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'message_count'
    ) THEN
        ALTER TABLE profiles ADD COLUMN message_count INT DEFAULT 0;
        RAISE NOTICE 'Added message_count column to profiles table';
    ELSE
        RAISE NOTICE 'message_count column already exists in profiles table';
    END IF;
END $$;

-- =================================================================
-- BƯỚC 3: CẬP NHẬT BẢNG MESSAGES
-- =================================================================

-- Thêm các cột mới vào bảng messages
DO $$
BEGIN
    -- Thêm cột message_type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'message_type'
    ) THEN
        ALTER TABLE messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text';
        ALTER TABLE messages ADD CONSTRAINT chk_message_type 
            CHECK (message_type IN ('text', 'image', 'video', 'file', 'audio'));
        RAISE NOTICE 'Added message_type column to messages table';
    END IF;

    -- Thêm cột deleted_at cho soft delete
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE messages ADD COLUMN deleted_at TIMESTAMPTZ;
        RAISE NOTICE 'Added deleted_at column to messages table';
    END IF;

    -- Thêm cột is_pinned
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'is_pinned'
    ) THEN
        ALTER TABLE messages ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_pinned column to messages table';
    END IF;

    -- Thêm cột pinned_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'pinned_at'
    ) THEN
        ALTER TABLE messages ADD COLUMN pinned_at TIMESTAMPTZ;
        RAISE NOTICE 'Added pinned_at column to messages table';
    END IF;
END $$;

-- =================================================================
-- BƯỚC 4: TẠO BẢNG MESSAGE_REACTIONS
-- =================================================================

-- Tạo bảng message_reactions nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS message_reactions (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_reactions_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate reactions
    CONSTRAINT unique_user_message_reaction UNIQUE (message_id, user_id)
);

COMMENT ON TABLE message_reactions IS 'Lưu trữ các phản ứng (emoji) của người dùng với tin nhắn.';

-- =================================================================
-- BƯỚC 5: TẠO CÁC INDEXES MỚI
-- =================================================================

-- Tạo các indexes mới cho messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages (match_id, read_at IS NULL) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON messages (match_id, is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages (message_type);
CREATE INDEX IF NOT EXISTS idx_messages_deleted ON messages (deleted_at) WHERE deleted_at IS NULL;

-- Tạo các indexes cho message_reactions
CREATE INDEX IF NOT EXISTS idx_reactions_message ON message_reactions (message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON message_reactions (user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON message_reactions (reaction_type);

-- Tạo full-text search index cho nội dung tin nhắn
CREATE INDEX IF NOT EXISTS idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

-- =================================================================
-- BƯỚC 6: TẠO CÁC FUNCTIONS VÀ TRIGGERS
-- =================================================================

-- Function để cập nhật thống kê tin nhắn
CREATE OR REPLACE FUNCTION update_message_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Cập nhật số lượng tin nhắn trong bảng profiles
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles 
        SET message_count = message_count + 1 
        WHERE user_id = NEW.sender_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles 
        SET message_count = GREATEST(message_count - 1, 0) 
        WHERE user_id = OLD.sender_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function để xử lý soft delete tin nhắn
CREATE OR REPLACE FUNCTION soft_delete_message()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        -- Cập nhật số lượng tin nhắn khi tin nhắn bị soft delete
        UPDATE profiles 
        SET message_count = GREATEST(message_count - 1, 0) 
        WHERE user_id = OLD.sender_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo triggers nếu chưa tồn tại
DO $$
BEGIN
    -- Trigger cho thống kê tin nhắn
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_message_stats'
    ) THEN
        CREATE TRIGGER trigger_update_message_stats
            AFTER INSERT OR DELETE ON messages
            FOR EACH ROW
            EXECUTE FUNCTION update_message_stats();
        RAISE NOTICE 'Created trigger_update_message_stats trigger';
    END IF;

    -- Trigger cho soft delete
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_soft_delete_message'
    ) THEN
        CREATE TRIGGER trigger_soft_delete_message
            AFTER UPDATE ON messages
            FOR EACH ROW
            EXECUTE FUNCTION soft_delete_message();
        RAISE NOTICE 'Created trigger_soft_delete_message trigger';
    END IF;
END $$;

-- =================================================================
-- BƯỚC 7: TẠO VIEWS
-- =================================================================

-- Tạo view cho thống kê tin nhắn
CREATE OR REPLACE VIEW message_statistics AS
SELECT 
    m.match_id,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN m.sender_id = u.id THEN 1 END) as sent_messages,
    COUNT(CASE WHEN m.sender_id != u.id THEN 1 END) as received_messages,
    COUNT(CASE WHEN m.read_at IS NULL AND m.sender_id != u.id THEN 1 END) as unread_messages,
    MAX(m.sent_at) as last_message_time,
    COUNT(CASE WHEN m.is_pinned = TRUE THEN 1 END) as pinned_messages
FROM messages m
JOIN matches mt ON m.match_id = mt.id
JOIN users u ON (mt.user1_id = u.id OR mt.user2_id = u.id)
WHERE m.deleted_at IS NULL
GROUP BY m.match_id, u.id;

COMMENT ON VIEW message_statistics IS 'View cung cấp thống kê chi tiết về tin nhắn trong các cuộc hội thoại.';

-- =================================================================
-- BƯỚC 8: CẬP NHẬT DỮ LIỆU HIỆN CÓ
-- =================================================================

-- Cập nhật message_count cho tất cả users dựa trên dữ liệu hiện có
UPDATE profiles 
SET message_count = (
    SELECT COUNT(*) 
    FROM messages 
    WHERE sender_id = profiles.user_id 
    AND deleted_at IS NULL
);

-- =================================================================
-- BƯỚC 9: VERIFICATION
-- =================================================================

-- Kiểm tra xem migration đã thành công
DO $$
DECLARE
    message_count_check INTEGER;
    reaction_count_check INTEGER;
BEGIN
    -- Kiểm tra số lượng tin nhắn
    SELECT COUNT(*) INTO message_count_check FROM messages;
    
    -- Kiểm tra bảng reactions
    SELECT COUNT(*) INTO reaction_count_check FROM message_reactions;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Total messages: %', message_count_check;
    RAISE NOTICE 'Total reactions: %', reaction_count_check;
END $$;

-- =================================================================
-- BƯỚC 10: CLEANUP
-- =================================================================

-- Xóa bảng backup sau khi migration thành công
-- DROP TABLE messages_backup;

-- Commit transaction
COMMIT;

-- =================================================================
-- MIGRATION HOÀN TẤT
-- =================================================================
SELECT 'Migration 002_enhance_messages_system completed successfully!' AS status;
