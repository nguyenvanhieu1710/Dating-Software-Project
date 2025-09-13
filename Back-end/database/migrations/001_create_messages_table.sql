-- Migration: Create enhanced messages table
-- Date: 2024-01-15

-- Drop existing table if exists
DROP TABLE IF EXISTS message_reactions CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

-- Create enhanced messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'audio')),
    sent_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    pinned_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    CONSTRAINT fk_messages_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create message reactions table
CREATE TABLE message_reactions (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_reactions_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate reactions
    CONSTRAINT unique_user_message_reaction UNIQUE (message_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_messages_match_sent ON messages(match_id, sent_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(match_id, read_at IS NULL) WHERE read_at IS NULL;
CREATE INDEX idx_messages_pinned ON messages(match_id, is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_deleted ON messages(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_reactions_message ON message_reactions(message_id);
CREATE INDEX idx_reactions_user ON message_reactions(user_id);
CREATE INDEX idx_reactions_type ON message_reactions(reaction_type);

-- Create full-text search index for message content
CREATE INDEX idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

-- Create function to update message statistics
CREATE OR REPLACE FUNCTION update_message_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user message count in profiles table
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

-- Create trigger for message statistics
CREATE TRIGGER trigger_update_message_stats
    AFTER INSERT OR DELETE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_message_stats();

-- Create function to handle message deletion (soft delete)
CREATE OR REPLACE FUNCTION soft_delete_message()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        -- Update message count when message is soft deleted
        UPDATE profiles 
        SET message_count = GREATEST(message_count - 1, 0) 
        WHERE user_id = OLD.sender_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for soft delete
CREATE TRIGGER trigger_soft_delete_message
    AFTER UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION soft_delete_message();

-- Create view for message statistics
CREATE VIEW message_statistics AS
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

-- Insert sample data for testing
INSERT INTO messages (match_id, sender_id, content, message_type) VALUES
(1, 1, 'Hello! How are you?', 'text'),
(1, 2, 'Hi! I''m doing great, thanks!', 'text'),
(1, 1, 'That''s wonderful to hear!', 'text'),
(2, 3, 'Hey there! 😊', 'text'),
(2, 4, 'Hello! Nice to meet you!', 'text');

-- Insert sample reactions
INSERT INTO message_reactions (message_id, user_id, reaction_type) VALUES
(1, 2, 'like'),
(2, 1, 'love'),
(3, 2, 'like'),
(4, 4, 'love'),
(5, 3, 'like');

-- Update profiles with message counts
UPDATE profiles 
SET message_count = (
    SELECT COUNT(*) 
    FROM messages 
    WHERE sender_id = profiles.user_id 
    AND deleted_at IS NULL
); 