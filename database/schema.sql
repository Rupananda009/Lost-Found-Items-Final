-- ====================================================
-- LOST & FOUND APPLICATION DATABASE SCHEMA
-- Compatible with PostgreSQL and MySQL
-- ====================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user', -- 'user', 'finder', 'admin'
    profile_image TEXT,
    phone VARCHAR(32),
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'suspended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ITEMS TABLE
CREATE TABLE IF NOT EXISTS items (
    item_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(16) NOT NULL, -- 'lost', 'found'
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Electronics', 'Documents', 'Wallet', 'Keys', 'Bags', 'Books', 'Clothing', 'Jewelry', 'Accessories', 'Other'
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(64),
    additional_details TEXT,
    image_url TEXT,
    contact_preference VARCHAR(64) DEFAULT 'in_app', -- 'in_app', 'email', 'phone'
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'potential_match', 'claim_pending', 'returned', 'closed'
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CLAIMS TABLE
CREATE TABLE IF NOT EXISTS claims (
    claim_id VARCHAR(64) PRIMARY KEY,
    item_id VARCHAR(64) NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    unique_feature TEXT NOT NULL,
    inside_items TEXT,
    exact_location TEXT NOT NULL,
    proof_notes TEXT,
    proof_image_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected', 'completed'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MATCHES TABLE
CREATE TABLE IF NOT EXISTS matches (
    match_id VARCHAR(64) PRIMARY KEY,
    lost_item_id VARCHAR(64) NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    found_item_id VARCHAR(64) NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    similarity_score INTEGER NOT NULL, -- 0 to 100 percentage
    match_reason TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'suggested', -- 'suggested', 'confirmed', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) NOT NULL, -- 'match_found', 'claim_submitted', 'claim_approved', 'claim_rejected', 'item_returned', 'contact_request', 'system'
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CONTACT_REQUESTS TABLE (Safe in-app messaging without exposing personal phone/email)
CREATE TABLE IF NOT EXISTS contact_requests (
    request_id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_items_type_status ON items(type, status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
CREATE INDEX IF NOT EXISTS idx_claims_item ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_lost ON matches(lost_item_id);
CREATE INDEX IF NOT EXISTS idx_matches_found ON matches(found_item_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
