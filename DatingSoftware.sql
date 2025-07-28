-- Kích hoạt extension PostGIS nếu chưa được kích hoạt
-- Bạn cần chạy lệnh này với quyền superuser nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Dùng để tạo UUID nếu cần
CREATE EXTENSION IF NOT EXISTS postgis;

-- Xóa các bảng cũ nếu tồn tại để tránh lỗi khi chạy lại script
DROP TABLE IF EXISTS messages, matches, swipes, subscriptions, consumables, profile_interests, interests, photos, settings, profiles, users CASCADE;
DROP TYPE IF EXISTS user_status, gender, swipe_action, match_status, subscription_plan, subscription_status, preferred_gender_option;

-- =================================================================
-- ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ENUM (TYPE)
-- =================================================================

CREATE TYPE user_status AS ENUM ('active', 'banned', 'unverified', 'deleted');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE swipe_action AS ENUM ('like', 'pass', 'superlike');
CREATE TYPE match_status AS ENUM ('active', 'unmatched');
CREATE TYPE subscription_plan AS ENUM ('plus', 'gold', 'platinum');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE preferred_gender_option AS ENUM ('male', 'female', 'all');


-- =================================================================
-- TẠO CÁC BẢNG (TABLES)
-- =================================================================

-- 1. Bảng `users` - Lưu thông tin đăng nhập và trạng thái
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    status user_status NOT NULL DEFAULT 'unverified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Lưu trữ thông tin xác thực và trạng thái cơ bản của người dùng.';


-- 2. Bảng `profiles` - Lưu thông tin chi tiết của hồ sơ
CREATE TABLE profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    gender gender NOT NULL,
    bio TEXT,
    job_title VARCHAR(100),
    school VARCHAR(100),
    location GEOGRAPHY(Point, 4326), -- Quan trọng: Dùng PostGIS cho vị trí
    popularity_score REAL DEFAULT 0.0,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE profiles IS 'Hồ sơ chi tiết của người dùng, liên kết 1-1 với bảng users.';


-- 3. Bảng `settings` - Lưu cài đặt tìm kiếm của người dùng
CREATE TABLE settings (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    preferred_gender preferred_gender_option NOT NULL DEFAULT 'all',
    min_age INT NOT NULL DEFAULT 18 CHECK (min_age >= 18),
    max_age INT NOT NULL DEFAULT 55 CHECK (max_age >= min_age),
    max_distance_km INT NOT NULL DEFAULT 50 CHECK (max_distance_km > 0),
    is_discoverable BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE settings IS 'Cài đặt tìm kiếm và hiển thị của người dùng.';


-- 4. Bảng `photos` - Lưu ảnh của người dùng
CREATE TABLE photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    order_index SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE photos IS 'Lưu trữ URL ảnh của người dùng và thứ tự hiển thị.';


-- 5. Bảng `swipes` - Ghi lại tất cả các hành động vuốt
CREATE TABLE swipes (
    id BIGSERIAL PRIMARY KEY,
    swiper_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    swiped_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action swipe_action NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(swiper_user_id, swiped_user_id) -- Mỗi người chỉ được vuốt 1 người 1 lần
);
COMMENT ON TABLE swipes IS 'Ghi lại mọi hành động Thích, Bỏ qua, Siêu Thích. Bảng có lượng ghi rất lớn.';


-- 6. Bảng `matches` - Lưu các cặp đôi đã tương hợp
CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status match_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Đảm bảo user1_id luôn nhỏ hơn user2_id để tránh trùng lặp (A,B) và (B,A)
    CHECK (user1_id < user2_id),
    UNIQUE (user1_id, user2_id)
);
COMMENT ON TABLE matches IS 'Lưu các cặp đôi đã tương hợp với nhau.';


-- 7. Bảng `messages` - Lưu trữ tin nhắn giữa các cặp đôi
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ -- NULL nếu chưa đọc
);
COMMENT ON TABLE messages IS 'Lưu trữ toàn bộ nội dung chat.';


-- 8. Bảng `subscriptions` - Quản lý các gói đăng ký Premium
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type subscription_plan NOT NULL,
    status subscription_status NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    payment_gateway_transaction_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE subscriptions IS 'Quản lý các gói Premium của người dùng.';


-- 9. Bảng `consumables` - Quản lý vật phẩm dùng một lần (Boosts, Super Likes)
CREATE TABLE consumables (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    super_likes_balance INT NOT NULL DEFAULT 0,
    boosts_balance INT NOT NULL DEFAULT 0,
    last_super_like_reset TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE consumables IS 'Lưu số lượng vật phẩm tiêu thụ như Super Likes và Boosts.';


-- =================================================================
-- TẠO CÁC CHỈ MỤC (INDEXES) ĐỂ TỐI ƯU HÓA TRUY VẤN
-- =================================================================

-- Chỉ mục cho vị trí địa lý trên bảng `profiles`
CREATE INDEX idx_profiles_location ON profiles USING GIST (location);
COMMENT ON INDEX idx_profiles_location IS 'Tăng tốc truy vấn tìm kiếm theo vị trí địa lý.';

-- Chỉ mục cho bảng `photos` để truy vấn ảnh của một người dùng nhanh hơn
CREATE INDEX idx_photos_user_id ON photos (user_id);

-- Chỉ mục cho bảng `swipes` để kiểm tra nhanh và tìm kiếm
CREATE INDEX idx_swipes_swiped_user_id ON swipes (swiped_user_id);
COMMENT ON INDEX idx_swipes_swiped_user_id IS 'Tăng tốc việc tìm xem ai đã "thích" một người dùng.';

-- Chỉ mục cho bảng `messages` để tải lịch sử chat hiệu quả
CREATE INDEX idx_messages_match_id_sent_at ON messages (match_id, sent_at DESC);
COMMENT ON INDEX idx_messages_match_id_sent_at IS 'Tăng tốc việc tải lịch sử chat của một cuộc hội thoại.';

-- Chỉ mục cho `subscriptions` để kiểm tra trạng thái gói cước của người dùng
CREATE INDEX idx_subscriptions_user_id_status ON subscriptions (user_id, status);

-- =================================================================
-- TẠO CÁC TRIGGER ĐỂ TỰ ĐỘNG CẬP NHẬT `updated_at`
-- =================================================================

-- Tạo một hàm trigger chung
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gán trigger cho các bảng cần thiết
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON consumables
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- =================================================================
-- SCRIPT HOÀN TẤT
-- =================================================================
SELECT 'Database schema created successfully!' AS status;