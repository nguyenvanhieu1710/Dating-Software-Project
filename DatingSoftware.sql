-- CREATE DATABASE dating_software;
-- =================================================================
-- New Database Schema for Dating Software (expanded to support Mobile apps)
-- Requirements gathered from Mobile User & Admin front-ends
-- PostgreSQL + PostGIS
-- 
-- This schema defines the complete database structure for the dating application,
-- including user management, matching, messaging, and monetization features.
-- 
-- Author: Nguyen Van Hieu
-- Created: 2025-09-18
-- Last Updated: 2025-09-18
-- =================================================================

-- =================================================================
-- Extensions
-- =================================================================
-- Enable UUID generation for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geographical queries and location-based features
CREATE EXTENSION IF NOT EXISTS postgis;

-- =================================================================
-- Cleanup: Drop existing objects (idempotent for re-runs during development)
-- =================================================================
-- This section ensures a clean slate by dropping all existing database objects
-- in the correct order to avoid foreign key constraint violations.
DROP VIEW IF EXISTS message_statistics CASCADE;
DROP TABLE IF EXISTS moderation_actions, moderation_reports, notifications, user_devices, user_blocks,
    profile_goals, goals, profile_interests, interests,
    message_attachments, message_reactions, messages,
    matches, swipes, subscriptions, payments, consumables, photos, settings, profiles, users,
    admin_users CASCADE;

DROP TYPE IF EXISTS user_status, gender, swipe_action, match_status,
    subscription_plan, subscription_status, billing_cycle, payment_method,
    consumable_type, consumable_status, verification_type, verification_status,
    moderation_content_type, moderation_status, moderation_priority, refund_status;

-- =================================================================
-- Enumerated Types
-- =================================================================
-- Custom enumerated types ensure data integrity by restricting column values
-- to a predefined set of options, making the schema more self-documenting.
-- User account statuses
CREATE TYPE user_status AS ENUM (
    'active',      -- User account is active and can use all features
    'banned',      -- User is banned from the platform
    'unverified',  -- User registered but hasn't verified their email/phone
    'deleted'      -- User requested account deletion (soft delete)
);

-- Gender options for user profiles
CREATE TYPE gender AS ENUM (
    'male',    -- Male gender
    'female',  -- Female gender
    'other'    -- Other/non-binary gender
);

-- Possible actions when swiping on a profile
CREATE TYPE swipe_action AS ENUM (
    'like',      -- User liked the profile
    'pass',      -- User passed on the profile
    'superlike'  -- User used a super like on the profile
);

-- Status of a match between two users
CREATE TYPE match_status AS ENUM (
    'active',   -- Match is active and visible to both users
    'unmatched' -- One user unmatched the other
);

-- Subscription plan types
CREATE TYPE subscription_plan AS ENUM (
    'plus',          -- Basic subscription tier
    'gold',          -- Mid-tier subscription
    'platinum',      -- Premium subscription
    'premium',       -- Alternative premium tier
    'premium_plus'   -- Highest subscription tier
);

-- Subscription statuses
CREATE TYPE subscription_status AS ENUM (
    'active',    -- Subscription is active
    'cancelled', -- User cancelled but still has time remaining
    'expired',   -- Subscription has expired
    'paused',    -- Subscription is paused
    'pending'    -- Payment is pending
);

-- Billing frequency options
CREATE TYPE billing_cycle AS ENUM (
    'monthly',   -- Bill every month
    'quarterly', -- Bill every 3 months
    'yearly'     -- Bill annually
);

-- Payment methods accepted by the platform
CREATE TYPE payment_method AS ENUM (
    'credit_card',  -- Credit/debit card
    'paypal',       -- PayPal payment
    'apple_pay',    -- Apple Pay
    'google_pay',   -- Google Pay
    'bank_transfer' -- Bank transfer
);

-- Status of refund processing
CREATE TYPE refund_status AS ENUM (
    'none',      -- No refund requested
    'pending',   -- Refund requested but not processed
    'processed', -- Refund has been processed
    'rejected'   -- Refund request was rejected
);

-- Types of consumable in-app purchases
CREATE TYPE consumable_type AS ENUM (
    'boost',              -- Profile boost
    'super_like',         -- Super like
    'rewind',             -- Rewind last swipe
    'passport',           -- Change location
    'premium_subscription' -- Premium subscription (handled differently)
);

-- Status of consumable items
CREATE TYPE consumable_status AS ENUM (
    'active',   -- Item is available for use
    'used',     -- Item has been used
    'expired',  -- Item has expired
    'refunded'  -- Item was refunded
);

-- Types of verification that can be performed
CREATE TYPE verification_type AS ENUM (
    'photo',  -- Photo verification
    'id',     -- ID verification
    'phone'   -- Phone verification
);

-- Status of verification processes
CREATE TYPE verification_status AS ENUM (
    'verified',     -- Successfully verified
    'pending',      -- Verification in progress
    'rejected',     -- Verification was rejected
    'not_submitted' -- User hasn't submitted verification
);

-- Types of content that can be moderated
CREATE TYPE moderation_content_type AS ENUM (
    'user',    -- User profile
    'photo',   -- Profile photo
    'message', -- Private message
    'profile'  -- Profile information
);

-- Moderation statuses
CREATE TYPE moderation_status AS ENUM (
    'pending',   -- Waiting for review
    'approved',  -- Content approved
    'rejected',  -- Content rejected
    'escalated'  -- Sent for further review
);

-- Priority levels for moderation tasks
CREATE TYPE moderation_priority AS ENUM (
    'low',     -- Low priority
    'medium',  -- Medium priority
    'high',    -- High priority
    'urgent'   -- Requires immediate attention
);

-- =================================================================
-- Core Tables
-- =================================================================
-- These tables store the fundamental data for the application's core functionality.
-- They include user accounts, profiles, and essential relationship definitions.

-- Users: authentication and base account state
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    status user_status NOT NULL DEFAULT 'unverified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Stores user authentication and account information including email, phone, and password hashes.';

COMMENT ON COLUMN users.id IS 'Primary key, auto-incrementing user identifier';
COMMENT ON COLUMN users.email IS 'User''s email address, must be unique';
COMMENT ON COLUMN users.phone_number IS 'User''s phone number, must be unique';
COMMENT ON COLUMN users.password_hash IS 'Hashed password using secure hashing algorithm';
COMMENT ON COLUMN users.status IS 'Current status of the user account (active/banned/unverified/deleted)';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user account was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user account was last updated';

-- Admin users with elevated privileges for platform management
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'moderator')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by BIGINT
);

COMMENT ON TABLE admin_users IS 'Stores administrator accounts with various permission levels for platform management.';

COMMENT ON COLUMN admin_users.id IS 'Primary key, auto-incrementing admin user identifier';
COMMENT ON COLUMN admin_users.email IS 'Unique email address for admin login';
COMMENT ON COLUMN admin_users.password_hash IS 'Hashed password using secure hashing algorithm';
COMMENT ON COLUMN admin_users.full_name IS 'Full name of the admin user';
COMMENT ON COLUMN admin_users.role IS 'Permission level (superadmin/admin/moderator)';
COMMENT ON COLUMN admin_users.is_active IS 'Whether the admin account is active';
COMMENT ON COLUMN admin_users.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN admin_users.created_at IS 'When the admin account was created';
COMMENT ON COLUMN admin_users.updated_at IS 'When the admin account was last updated';
COMMENT ON COLUMN admin_users.created_by IS 'Admin user who created this account (self-reference for superadmin)';

-- Profiles: user public and matching info (1-1 with users)
CREATE TABLE profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    gender gender NOT NULL,
    bio TEXT,
    job_title VARCHAR(100),
    company VARCHAR(120),
    school VARCHAR(120),
    education VARCHAR(120),
    height_cm SMALLINT CHECK (height_cm BETWEEN 90 AND 250),
    relationship_goals VARCHAR(100),
    location GEOGRAPHY(Point, 4326),
    popularity_score REAL DEFAULT 0.0,
    message_count INT DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE profiles IS 'Stores detailed personal and public information about users for matching and display purposes.';

COMMENT ON COLUMN profiles.user_id IS 'References users.id, one-to-one relationship with users table';
COMMENT ON COLUMN profiles.first_name IS 'User''s first name for display purposes';
COMMENT ON COLUMN profiles.dob IS 'Date of birth for age calculation and verification';
COMMENT ON COLUMN profiles.gender IS 'User''s self-identified gender';
COMMENT ON COLUMN profiles.bio IS 'Short biography/description written by the user';
COMMENT ON COLUMN profiles.job_title IS 'User''s current job title';
COMMENT ON COLUMN profiles.company IS 'User''s current employer';
COMMENT ON COLUMN profiles.school IS 'Educational institution the user attended';
COMMENT ON COLUMN profiles.education IS 'Highest level of education completed';
COMMENT ON COLUMN profiles.height_cm IS 'User''s height in centimeters (90-250cm)';
COMMENT ON COLUMN profiles.relationship_goals IS 'What the user is looking for in relationships';
COMMENT ON COLUMN profiles.location IS 'Geographic location stored as GeoJSON Point (longitude, latitude)';
COMMENT ON COLUMN profiles.popularity_score IS 'Calculated score based on user engagement';
COMMENT ON COLUMN profiles.message_count IS 'Total number of messages sent by the user';
COMMENT ON COLUMN profiles.last_active_at IS 'Last time the user was active on the platform';
COMMENT ON COLUMN profiles.is_verified IS 'Indicates if the user has completed verification';
COMMENT ON COLUMN profiles.is_online IS 'Current online status of the user';
COMMENT ON COLUMN profiles.last_seen IS 'When the user was last seen online';
COMMENT ON COLUMN profiles.created_at IS 'When the profile was created';
COMMENT ON COLUMN profiles.updated_at IS 'When the profile was last updated';

-- Settings: user preferences and privacy
CREATE TABLE settings (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    -- Discovery preferences
    preferred_gender gender NULL,
    min_age INT NOT NULL DEFAULT 18 CHECK (min_age >= 18),
    max_age INT NOT NULL DEFAULT 55 CHECK (max_age >= min_age AND max_age <= 100),
    max_distance_km INT NOT NULL DEFAULT 50 CHECK (max_distance_km > 0 AND max_distance_km <= 1000),
    show_me GENDER[] NOT NULL DEFAULT ARRAY['male', 'female']::GENDER[],
    
    -- Privacy settings
    is_discoverable BOOLEAN NOT NULL DEFAULT TRUE,
    hide_age BOOLEAN NOT NULL DEFAULT FALSE,
    hide_distance BOOLEAN NOT NULL DEFAULT FALSE,
    show_last_active BOOLEAN NOT NULL DEFAULT TRUE,
    show_online_status BOOLEAN NOT NULL DEFAULT TRUE,
    block_messages_from_strangers BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Notification settings
    new_matches_notification BOOLEAN NOT NULL DEFAULT TRUE,
    new_messages_notification BOOLEAN NOT NULL DEFAULT TRUE,
    message_likes_notification BOOLEAN NOT NULL DEFAULT TRUE,
    message_super_likes_notification BOOLEAN NOT NULL DEFAULT TRUE,
    profile_views_notification BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    promotional_emails BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Account settings
    language VARCHAR(10) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'vi', 'ja', 'ko', 'zh')),
    theme VARCHAR(10) NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    account_type VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (account_type IN ('free', 'premium', 'gold')),
    verification_status verification_status NOT NULL DEFAULT 'pending',
    
    -- Additional flexible settings
    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_age_range CHECK (min_age <= max_age)
);
COMMENT ON TABLE settings IS 'Stores user preferences, privacy settings, and notification configurations.';

COMMENT ON COLUMN settings.user_id IS 'References users.id, one-to-one relationship with users table';
COMMENT ON COLUMN settings.preferred_gender IS 'Preferred gender for potential matches';
COMMENT ON COLUMN settings.min_age IS 'Minimum age preference for matches';
COMMENT ON COLUMN settings.max_age IS 'Maximum age preference for matches';
COMMENT ON COLUMN settings.max_distance_km IS 'Maximum distance in kilometers for potential matches';
COMMENT ON COLUMN settings.show_me IS 'Array of genders the user wants to see in their feed';
COMMENT ON COLUMN settings.is_discoverable IS 'Whether the profile appears in discovery';
COMMENT ON COLUMN settings.hide_age IS 'Privacy setting to hide age';
COMMENT ON COLUMN settings.hide_distance IS 'Privacy setting to hide distance';
COMMENT ON COLUMN settings.show_last_active IS 'Whether to show when the user was last active';
COMMENT ON COLUMN settings.show_online_status IS 'Whether to show if the user is currently online';
COMMENT ON COLUMN settings.block_messages_from_strangers IS 'Whether to block messages from non-matches';
COMMENT ON COLUMN settings.new_matches_notification IS 'Enable/disable new match notifications';
COMMENT ON COLUMN settings.new_messages_notification IS 'Enable/disable new message notifications';
COMMENT ON COLUMN settings.message_likes_notification IS 'Enable/disable like notifications';
COMMENT ON COLUMN settings.message_super_likes_notification IS 'Enable/disable super like notifications';
COMMENT ON COLUMN settings.profile_views_notification IS 'Enable/disable profile view notifications';
COMMENT ON COLUMN settings.email_notifications IS 'Global toggle for email notifications';
COMMENT ON COLUMN settings.push_notifications IS 'Global toggle for push notifications';
COMMENT ON COLUMN settings.promotional_emails IS 'Opt-in for marketing emails';
COMMENT ON COLUMN settings.language IS 'User''s preferred language';
COMMENT ON COLUMN settings.theme IS 'UI theme preference';
COMMENT ON COLUMN settings.account_type IS 'Type of account (free/premium/gold)';
COMMENT ON COLUMN settings.verification_status IS 'Current verification status';
COMMENT ON COLUMN settings.preferences IS 'JSONB field for additional flexible settings';
COMMENT ON COLUMN settings.created_at IS 'When the settings were created';
COMMENT ON COLUMN settings.updated_at IS 'When the settings were last updated';

-- Photos: ordered photos per user
CREATE TABLE photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    order_index SMALLINT NOT NULL DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE photos IS 'Stores user-uploaded photos with ordering and visibility settings.';

COMMENT ON COLUMN photos.id IS 'Primary key, auto-incrementing photo identifier';
COMMENT ON COLUMN photos.user_id IS 'References users.id, owner of the photo';
COMMENT ON COLUMN photos.url IS 'CDN or storage URL where the photo is hosted';
COMMENT ON COLUMN photos.order_index IS 'Position of the photo in the user''s profile (0-based index)';
COMMENT ON COLUMN photos.is_public IS 'Whether the photo is visible to other users';
COMMENT ON COLUMN photos.created_at IS 'When the photo was uploaded';

-- Interests catalog and user selections
CREATE TABLE interests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE interests IS 'Master list of available interests that users can select for their profiles.';

COMMENT ON COLUMN interests.id IS 'Primary key, auto-incrementing interest identifier';
COMMENT ON COLUMN interests.name IS 'Name of the interest (e.g., Hiking, Photography)';
COMMENT ON COLUMN interests.category IS 'Category for grouping related interests (e.g., Sports, Arts, Music)';
COMMENT ON COLUMN interests.is_active IS 'Whether the interest is active';
COMMENT ON COLUMN interests.created_at IS 'When the interest was created';
COMMENT ON COLUMN interests.updated_at IS 'When the interest was last updated';

CREATE TABLE profile_interests (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id BIGINT NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);
COMMENT ON TABLE profile_interests IS 'Junction table linking users to their selected interests.';

COMMENT ON COLUMN profile_interests.user_id IS 'References users.id';
COMMENT ON COLUMN profile_interests.interest_id IS 'References interests.id';
COMMENT ON COLUMN profile_interests.created_at IS 'When the interest was added to the profile';

-- Relationship goals catalog and user selections
CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE goals IS 'Master list of relationship goals that users can select from.';

COMMENT ON COLUMN goals.id IS 'Primary key, auto-incrementing goal identifier';
COMMENT ON COLUMN goals.name IS 'Name of the relationship goal (e.g., Long-term relationship, Casual dating)';
COMMENT ON COLUMN goals.description IS 'Description of the relationship goal';
COMMENT ON COLUMN goals.is_active IS 'Whether the goal is active';
COMMENT ON COLUMN goals.created_at IS 'When the goal was created';
COMMENT ON COLUMN goals.updated_at IS 'When the goal was last updated';

CREATE TABLE profile_goals (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, goal_id)
);
COMMENT ON TABLE profile_goals IS 'Junction table linking users to their relationship goals.';

COMMENT ON COLUMN profile_goals.user_id IS 'References users.id';
COMMENT ON COLUMN profile_goals.goal_id IS 'References goals.id';
COMMENT ON COLUMN profile_goals.created_at IS 'When the goal was added to the profile';

-- Swipes
CREATE TABLE swipes (
    id BIGSERIAL PRIMARY KEY,
    swiper_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    swiped_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action swipe_action NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (swiper_user_id, swiped_user_id)
);
COMMENT ON TABLE swipes IS 'Tracks all swiping actions between users for matching purposes.';

COMMENT ON COLUMN swipes.id IS 'Primary key, auto-incrementing swipe identifier';
COMMENT ON COLUMN swipes.swiper_user_id IS 'User who performed the swipe';
COMMENT ON COLUMN swipes.swiped_user_id IS 'User who was swiped on';
COMMENT ON COLUMN swipes.action IS 'Type of swipe action (like/pass/superlike)';
COMMENT ON COLUMN swipes.created_at IS 'When the swipe occurred';

-- Matches
CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status match_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    CHECK (user1_id < user2_id),
    UNIQUE (user1_id, user2_id)
);
COMMENT ON TABLE matches IS 'Represents a mutual match between two users based on swipes.';

COMMENT ON COLUMN matches.id IS 'Primary key, auto-incrementing match identifier';
COMMENT ON COLUMN matches.user1_id IS 'First user in the match (lower user_id)';
COMMENT ON COLUMN matches.user2_id IS 'Second user in the match (higher user_id)';
COMMENT ON COLUMN matches.status IS 'Current status of the match (active/unmatched)';
COMMENT ON COLUMN matches.created_at IS 'When the match was created';
COMMENT ON COLUMN matches.last_message_at IS 'Timestamp of the most recent message';
COMMENT ON COLUMN matches.last_message_preview IS 'Preview text of the most recent message';

-- Messages + reactions and attachments
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'audio')),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    is_pinned BOOLEAN DEFAULT FALSE,
    pinned_at TIMESTAMPTZ,
    reply_to_message_id BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    edited_at TIMESTAMPTZ
);
COMMENT ON TABLE messages IS 'Stores all private messages between matched users.';

COMMENT ON COLUMN messages.id IS 'Primary key, auto-incrementing message identifier';
COMMENT ON COLUMN messages.match_id IS 'References matches.id, the conversation this message belongs to';
COMMENT ON COLUMN messages.sender_id IS 'User who sent the message';
COMMENT ON COLUMN messages.content IS 'The actual message content';
COMMENT ON COLUMN messages.message_type IS 'Type of message (text/image/video/etc)';
COMMENT ON COLUMN messages.sent_at IS 'When the message was sent';
COMMENT ON COLUMN messages.read_at IS 'When the message was read by the recipient';
COMMENT ON COLUMN messages.deleted_at IS 'When the message was soft-deleted';
COMMENT ON COLUMN messages.is_pinned IS 'Whether the message is pinned in the conversation';
COMMENT ON COLUMN messages.pinned_at IS 'When the message was pinned';
COMMENT ON COLUMN messages.reply_to_message_id IS 'If this is a reply, references the original message';
COMMENT ON COLUMN messages.edited_at IS 'When the message was last edited';

CREATE TABLE message_reactions (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_message_reaction UNIQUE (message_id, user_id)
);
COMMENT ON TABLE message_reactions IS 'Tracks reactions to individual messages.';

COMMENT ON COLUMN message_reactions.id IS 'Primary key, auto-incrementing reaction identifier';
COMMENT ON COLUMN message_reactions.message_id IS 'The message that was reacted to';
COMMENT ON COLUMN message_reactions.user_id IS 'User who added the reaction';
COMMENT ON COLUMN message_reactions.reaction_type IS 'Type of reaction (like/love/laugh/etc)';
COMMENT ON COLUMN message_reactions.created_at IS 'When the reaction was added';

CREATE TABLE message_attachments (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE message_attachments IS 'Stores files and media attached to messages.';

COMMENT ON COLUMN message_attachments.id IS 'Primary key, auto-incrementing attachment identifier';
COMMENT ON COLUMN message_attachments.message_id IS 'The message this attachment belongs to';
COMMENT ON COLUMN message_attachments.file_url IS 'URL to the attached file';
COMMENT ON COLUMN message_attachments.file_type IS 'MIME type of the attached file';
COMMENT ON COLUMN message_attachments.metadata IS 'Additional metadata about the attachment (dimensions, duration, etc)';
COMMENT ON COLUMN message_attachments.created_at IS 'When the attachment was created';

-- Blocks: user privacy
CREATE TABLE user_blocks (
    id BIGSERIAL PRIMARY KEY,
    blocker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (blocker_id, blocked_id)
);
COMMENT ON TABLE user_blocks IS 'Tracks blocking relationships between users for privacy and safety.';

COMMENT ON COLUMN user_blocks.id IS 'Primary key, auto-incrementing block identifier';
COMMENT ON COLUMN user_blocks.blocker_id IS 'User who initiated the block';
COMMENT ON COLUMN user_blocks.blocked_id IS 'User who was blocked';
COMMENT ON COLUMN user_blocks.created_at IS 'When the block was created';

-- Presence / Devices
CREATE TABLE user_devices (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20), -- ios|android|web
    device_model VARCHAR(100),
    device_token VARCHAR(255),
    app_version VARCHAR(50),
    last_ip VARCHAR(45),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE user_devices IS 'Tracks devices used to access the application for security and push notifications.';

COMMENT ON COLUMN user_devices.id IS 'Primary key, auto-incrementing device identifier';
COMMENT ON COLUMN user_devices.user_id IS 'User who owns this device';
COMMENT ON COLUMN user_devices.platform IS 'Operating system (ios/android/web)';
COMMENT ON COLUMN user_devices.device_model IS 'Model of the device';
COMMENT ON COLUMN user_devices.app_version IS 'Version of the app installed';
COMMENT ON COLUMN user_devices.last_ip IS 'Last known IP address';
COMMENT ON COLUMN user_devices.last_active_at IS 'When the device was last used';
COMMENT ON COLUMN user_devices.created_at IS 'When the device was first registered';
COMMENT ON COLUMN user_devices.updated_at IS 'When the device record was last updated';

-- Notifications (outbox/log)
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    body TEXT,
    data JSONB,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE notifications IS 'Stores all system notifications sent to users.';

COMMENT ON COLUMN notifications.id IS 'Primary key, auto-incrementing notification identifier';
COMMENT ON COLUMN notifications.user_id IS 'Recipient of the notification';
COMMENT ON COLUMN notifications.title IS 'Notification title';
COMMENT ON COLUMN notifications.body IS 'Notification message content';
COMMENT ON COLUMN notifications.data IS 'Additional JSON data for the notification';
COMMENT ON COLUMN notifications.sent_at IS 'When the notification was sent';
COMMENT ON COLUMN notifications.read_at IS 'When the notification was marked as read';
COMMENT ON COLUMN notifications.created_at IS 'When the notification record was created';

-- Subscriptions: Manages user subscription plans, billing cycles, and premium feature access
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type subscription_plan NOT NULL,
    status subscription_status NOT NULL,
    billing_cycle billing_cycle DEFAULT 'monthly',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    next_billing_date TIMESTAMPTZ,
    price NUMERIC(10,2),
    currency VARCHAR(10),
    payment_method payment_method,
    auto_renew BOOLEAN DEFAULT TRUE,
    trial_period BOOLEAN DEFAULT FALSE,
    trial_end_date TIMESTAMPTZ,
    discount_applied NUMERIC(10,2),
    promo_code VARCHAR(50),
    platform VARCHAR(20), -- ios|android|web
    transaction_id VARCHAR(255),
    payment_gateway_transaction_id VARCHAR(255),
    last_payment_date TIMESTAMPTZ,
    failed_payments INT DEFAULT 0,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    refund_status refund_status DEFAULT 'none',
    refund_amount NUMERIC(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE subscriptions IS 'Manages user subscription plans, billing cycles, and premium feature access.';

COMMENT ON COLUMN subscriptions.id IS 'Primary key, auto-incrementing subscription identifier';
COMMENT ON COLUMN subscriptions.user_id IS 'User who owns this subscription';
COMMENT ON COLUMN subscriptions.plan_type IS 'Type of subscription plan (e.g., basic, premium, gold)';
COMMENT ON COLUMN subscriptions.status IS 'Current status of the subscription (active, cancelled, expired, etc.)';
COMMENT ON COLUMN subscriptions.billing_cycle IS 'Billing frequency (monthly, quarterly, yearly)';
COMMENT ON COLUMN subscriptions.start_date IS 'When the subscription period begins';
COMMENT ON COLUMN subscriptions.end_date IS 'When the subscription period ends';
COMMENT ON COLUMN subscriptions.next_billing_date IS 'Next scheduled billing date (for recurring subscriptions)';
COMMENT ON COLUMN subscriptions.price IS 'Subscription price amount';
COMMENT ON COLUMN subscriptions.currency IS 'Currency code for the subscription price';
COMMENT ON COLUMN subscriptions.payment_method IS 'Payment method used for this subscription';
COMMENT ON COLUMN subscriptions.auto_renew IS 'Whether the subscription will automatically renew';
COMMENT ON COLUMN subscriptions.trial_period IS 'Whether this is a trial subscription';
COMMENT ON COLUMN subscriptions.trial_end_date IS 'When the trial period ends (if applicable)';
COMMENT ON COLUMN subscriptions.discount_applied IS 'Any discount amount applied to this subscription';
COMMENT ON COLUMN subscriptions.promo_code IS 'Promo code used for this subscription';
COMMENT ON COLUMN subscriptions.platform IS 'Platform where subscription was purchased (ios/android/web)';
COMMENT ON COLUMN subscriptions.transaction_id IS 'Unique identifier for the subscription transaction';
COMMENT ON COLUMN subscriptions.payment_gateway_transaction_id IS 'Transaction ID from the payment gateway';
COMMENT ON COLUMN subscriptions.last_payment_date IS 'When the last payment was processed';
COMMENT ON COLUMN subscriptions.failed_payments IS 'Number of consecutive failed payment attempts';
COMMENT ON COLUMN subscriptions.cancelled_at IS 'When the subscription was cancelled';
COMMENT ON COLUMN subscriptions.cancellation_reason IS 'Reason provided for cancellation';
COMMENT ON COLUMN subscriptions.refund_status IS 'Status of any refund for this subscription';
COMMENT ON COLUMN subscriptions.refund_amount IS 'Amount refunded (if any)';
COMMENT ON COLUMN subscriptions.created_at IS 'When the subscription record was created';
COMMENT ON COLUMN subscriptions.updated_at IS 'When the subscription record was last updated';

-- Consumable balances (aggregate)
CREATE TABLE consumables (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    super_likes_balance INT NOT NULL DEFAULT 0,
    boosts_balance INT NOT NULL DEFAULT 0,
    last_super_like_reset TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE consumables IS 'Tracks the current balance of consumable items (like super likes and boosts) for each user.';

COMMENT ON COLUMN consumables.user_id IS 'User who owns these consumable items';
COMMENT ON COLUMN consumables.super_likes_balance IS 'Current number of super likes available to the user';
COMMENT ON COLUMN consumables.boosts_balance IS 'Current number of profile boosts available to the user';
COMMENT ON COLUMN consumables.last_super_like_reset IS 'When the super like balance was last reset (for daily limits)';
COMMENT ON COLUMN consumables.updated_at IS 'When the consumable balance was last updated';

-- Payments: Records all payment transactions (subscriptions and consumables)
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE SET NULL,
    consumable_type consumable_type,
    quantity INT DEFAULT 1,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method payment_method NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    provider_response JSONB,
    status VARCHAR(30) NOT NULL DEFAULT 'succeeded',
    consumable_status consumable_status DEFAULT 'active',
    expiry_date TIMESTAMPTZ,
    platform VARCHAR(20), -- ios|android|web
    is_recurring BOOLEAN DEFAULT FALSE,
    next_billing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE payments IS 'Records all payment transactions for subscriptions and consumable items like super likes and boosts.';
COMMENT ON COLUMN payments.id IS 'Primary key, auto-incrementing payment identifier';
COMMENT ON COLUMN payments.user_id IS 'User who made the payment';
COMMENT ON COLUMN payments.subscription_id IS 'Associated subscription (if this is a subscription payment)';
COMMENT ON COLUMN payments.consumable_type IS 'Type of consumable purchased (super_like, boost, etc., if applicable)';
COMMENT ON COLUMN payments.quantity IS 'Number of units purchased (for consumables)';
COMMENT ON COLUMN payments.amount IS 'Payment amount in the specified currency';
COMMENT ON COLUMN payments.currency IS 'Currency code (e.g., USD, EUR, VND)';
COMMENT ON COLUMN payments.payment_method IS 'Payment method used (credit_card, paypal, etc.)';
COMMENT ON COLUMN payments.transaction_id IS 'Unique transaction identifier from payment processor';
COMMENT ON COLUMN payments.provider_response IS 'Raw response from payment provider in JSON format';
COMMENT ON COLUMN payments.status IS 'Current status of the payment (succeeded, failed, pending, refunded)';
COMMENT ON COLUMN payments.consumable_status IS 'Status of the consumable item (active, used, expired, refunded)';
COMMENT ON COLUMN payments.expiry_date IS 'Expiration date of the consumable item (if applicable)';
COMMENT ON COLUMN payments.platform IS 'Platform where payment was made (ios, android, web)';
COMMENT ON COLUMN payments.is_recurring IS 'Whether this is a recurring payment';
COMMENT ON COLUMN payments.next_billing_date IS 'Next billing date for recurring payments';
COMMENT ON COLUMN payments.created_at IS 'When the payment record was created';
COMMENT ON COLUMN payments.updated_at IS 'When the payment record was last updated';

-- Verification artifacts per user
CREATE TABLE user_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_type verification_type NOT NULL,
    status verification_status NOT NULL DEFAULT 'not_submitted',
    evidence_url VARCHAR(255),
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, verification_type)
);
COMMENT ON TABLE user_verifications IS 'Manages the verification process for user accounts and identity verification.';

COMMENT ON COLUMN user_verifications.id IS 'Primary key, auto-incrementing verification identifier';
COMMENT ON COLUMN user_verifications.user_id IS 'User being verified';
COMMENT ON COLUMN user_verifications.verification_type IS 'Type of verification (email, phone, photo_id, etc.)';
COMMENT ON COLUMN user_verifications.status IS 'Current status of the verification process';
COMMENT ON COLUMN user_verifications.evidence_url IS 'URL to the uploaded verification document';
COMMENT ON COLUMN user_verifications.reviewed_by IS 'Admin who reviewed the verification';
COMMENT ON COLUMN user_verifications.reviewed_at IS 'When the verification was reviewed';
COMMENT ON COLUMN user_verifications.notes IS 'Additional notes or comments about the verification';
COMMENT ON COLUMN user_verifications.created_at IS 'When the verification was requested';
COMMENT ON COLUMN user_verifications.updated_at IS 'When the verification record was last updated';

-- Moderation reports & actions
CREATE TABLE moderation_reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_content_id BIGINT,
    content_type moderation_content_type NOT NULL,
    reason VARCHAR(200) NOT NULL,
    description TEXT,
    status moderation_status NOT NULL DEFAULT 'pending',
    priority moderation_priority NOT NULL DEFAULT 'medium',
    admin_notes TEXT,
    resolved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE moderation_reports IS 'Tracks user reports of inappropriate content or behavior for moderation.';

COMMENT ON COLUMN moderation_reports.id IS 'Primary key, auto-incrementing report identifier';
COMMENT ON COLUMN moderation_reports.reporter_id IS 'User who submitted the report';
COMMENT ON COLUMN moderation_reports.reported_user_id IS 'User being reported';
COMMENT ON COLUMN moderation_reports.reported_content_id IS 'ID of the specific content being reported';
COMMENT ON COLUMN moderation_reports.content_type IS 'Type of content being reported (profile, photo, message, etc.)';
COMMENT ON COLUMN moderation_reports.reason IS 'Category of the report (harassment, inappropriate_content, etc.)';
COMMENT ON COLUMN moderation_reports.description IS 'Detailed description of the issue';
COMMENT ON COLUMN moderation_reports.status IS 'Current status of the report (pending, in_review, resolved, dismissed)';
COMMENT ON COLUMN moderation_reports.priority IS 'Priority level for handling the report (low, medium, high, critical)';
COMMENT ON COLUMN moderation_reports.admin_notes IS 'Internal notes from the moderation team';
COMMENT ON COLUMN moderation_reports.resolved_by IS 'Admin who resolved the report';
COMMENT ON COLUMN moderation_reports.resolved_at IS 'When the report was resolved';
COMMENT ON COLUMN moderation_reports.created_at IS 'When the report was created';
COMMENT ON COLUMN moderation_reports.updated_at IS 'When the report was last updated';

CREATE TABLE moderation_actions (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES moderation_reports(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- approve|reject|escalate|ban_user|delete_content
    action_details JSONB,
    status VARCHAR(50) NOT NULL, -- pending|completed|failed
    assigned_to BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE
);

COMMENT ON TABLE moderation_actions IS 'Tracks actions taken by moderators in response to user reports or content violations.';
COMMENT ON COLUMN moderation_actions.id IS 'Primary key, auto-incrementing action identifier';
COMMENT ON COLUMN moderation_actions.report_id IS 'Reference to the moderation report that triggered this action';
COMMENT ON COLUMN moderation_actions.action IS 'Type of moderation action taken (approve/reject/escalate/ban_user/delete_content)';
COMMENT ON COLUMN moderation_actions.action_details IS 'Additional details about the action in JSON format';
COMMENT ON COLUMN moderation_actions.status IS 'Current status of the action (pending/completed/failed)';
COMMENT ON COLUMN moderation_actions.assigned_to IS 'Admin user assigned to handle this action';
COMMENT ON COLUMN moderation_actions.completed_at IS 'When the action was completed';
COMMENT ON COLUMN moderation_actions.error_message IS 'Error message if the action failed';
COMMENT ON COLUMN moderation_actions.created_at IS 'When the action was created';
COMMENT ON COLUMN moderation_actions.created_by IS 'Admin user who initiated the action';

-- =================================================================
-- Stored Procedures
-- =================================================================


-- =================================================================
-- Indexes
-- =================================================================
-- Spatial index for location-based queries
CREATE INDEX idx_profiles_location ON profiles USING GIST (location);
-- User profile photos access optimization
CREATE INDEX idx_photos_user_id ON photos (user_id);
-- Optimize swipe operations
CREATE INDEX idx_swipes_swiped_user_id ON swipes (swiped_user_id);
-- Message retrieval optimization
CREATE INDEX idx_messages_match_id_sent_at ON messages (match_id, sent_at DESC);
CREATE INDEX idx_messages_sender ON messages (sender_id);
-- Optimize unread message queries
CREATE INDEX idx_messages_unread ON messages (match_id, read_at) WHERE read_at IS NULL;
-- Quick access to pinned messages
CREATE INDEX idx_messages_pinned ON messages (match_id, is_pinned) WHERE is_pinned = TRUE;
-- Filter messages by type
CREATE INDEX idx_messages_type ON messages (message_type);
-- Optimize soft-delete queries
CREATE INDEX idx_messages_deleted ON messages (deleted_at) WHERE deleted_at IS NULL;
-- Full-text search on message content
CREATE INDEX idx_messages_content_search ON messages USING GIN (to_tsvector('english', content));
-- Optimize reaction lookups
CREATE INDEX idx_reactions_message ON message_reactions (message_id);
CREATE INDEX idx_reactions_user ON message_reactions (user_id);
-- Blocking relationships optimization
CREATE INDEX idx_user_blocks_blocker ON user_blocks (blocker_id);
-- Device management optimization
CREATE INDEX idx_user_devices_user ON user_devices (user_id);
-- Subscription status lookups
CREATE INDEX idx_subscriptions_user_status ON subscriptions (user_id, status);
-- Moderation workflow optimization
CREATE INDEX idx_moderation_reports_status ON moderation_reports (status, priority);
-- Optimize discovery settings queries
CREATE INDEX idx_settings_discovery ON settings (is_discoverable, preferred_gender, min_age, max_age, max_distance_km);
-- Optimize notification settings queries
CREATE INDEX idx_settings_notifications ON settings (user_id) WHERE (
    new_matches_notification OR 
    new_messages_notification OR 
    message_likes_notification OR 
    message_super_likes_notification OR 
    profile_views_notification
);
-- Indexes for optimized querying of payments
CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_subscription_id ON payments (subscription_id) WHERE subscription_id IS NOT NULL;
CREATE INDEX idx_payments_consumable_type ON payments (consumable_type) WHERE consumable_type IS NOT NULL;
CREATE INDEX idx_payments_consumable_status ON payments (consumable_status) WHERE consumable_status IS NOT NULL;
CREATE INDEX idx_payments_created_at ON payments (created_at);

-- =================================================================
-- Triggers
-- =================================================================
-- Generic trigger function to automatically update the updated_at timestamp
-- whenever a record is modified. This helps track when records were last changed.
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_settings
BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_consumables
BEFORE UPDATE ON consumables
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_devices
BEFORE UPDATE ON user_devices
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subscriptions
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_payments
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_moderation_reports
BEFORE UPDATE ON moderation_reports
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Message Statistics Trigger
-- Maintains accurate message counts and updates match metadata
-- when messages are inserted or deleted.
CREATE OR REPLACE FUNCTION update_message_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment sender's message count
        UPDATE profiles SET message_count = message_count + 1 WHERE user_id = NEW.sender_id;
        -- Update match with latest message info (first 120 chars for preview)
        UPDATE matches 
        SET last_message_at = NEW.sent_at, 
            last_message_preview = LEFT(NEW.content, 120)
        WHERE id = NEW.match_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement message count (never go below 0)
        UPDATE profiles 
        SET message_count = GREATEST(message_count - 1, 0) 
        WHERE user_id = OLD.sender_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_stats
AFTER INSERT OR DELETE ON messages
FOR EACH ROW EXECUTE FUNCTION update_message_stats();

-- Soft Delete Message Trigger
-- Handles message soft-deletion by updating message counts
-- when a message is marked as deleted (deleted_at is set).
CREATE OR REPLACE FUNCTION soft_delete_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process if this is a new soft-delete (deleted_at was just set)
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        -- Decrement sender's message count (never go below 0)
        UPDATE profiles 
        SET message_count = GREATEST(message_count - 1, 0) 
        WHERE user_id = OLD.sender_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_soft_delete_message
AFTER UPDATE ON messages
FOR EACH ROW EXECUTE FUNCTION soft_delete_message();

-- =================================================================
-- Views (analytics)
-- =================================================================
-- Provides aggregated statistics about messages in each match/conversation
-- Used for displaying message counts and activity in the UI
CREATE OR REPLACE VIEW message_statistics AS
SELECT 
    m.match_id,                                   -- The match/conversation ID
    COUNT(*) FILTER (WHERE m.deleted_at IS NULL) AS total_messages,  -- Count of non-deleted messages
    MAX(m.sent_at) AS last_message_time,          -- When the last message was sent
    COUNT(*) FILTER (WHERE m.is_pinned = TRUE) AS pinned_messages  -- Number of pinned messages
FROM messages m
GROUP BY m.match_id;

-- =================================================================
-- Seed Data (Optional Initial Data)
-- =================================================================
-- Pre-populate interests that users can select from
-- Categories help organize interests in the UI
INSERT INTO interests (name, category) VALUES
    ('Travel', 'Lifestyle'),       -- Popular lifestyle interest
    ('Music', 'Entertainment'),    -- Common entertainment interest
    ('Sports', 'Fitness')          -- Fitness and activity interest
ON CONFLICT DO NOTHING;  -- Skip if already exists to allow multiple runs

-- Pre-defined relationship goals users can select from
-- These help users express what they're looking for
INSERT INTO goals (name) VALUES
    ('Long-term relationship'),  -- For users seeking serious commitment
    ('Short-term fun'),          -- For casual dating
    ('Friendship')               -- For platonic connections
ON CONFLICT DO NOTHING;  -- Skip if already exists

-- =================================================================
-- Schema Creation Completed
-- =================================================================
-- This script has successfully created the complete database schema
-- including tables, indexes, triggers, views, and initial data.
-- The schema is now ready for application use.
SELECT 'Database schema created successfully with all features.' AS status;


