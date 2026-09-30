-- ====================================================
-- SEED DATA FOR LOST & FOUND APPLICATION
-- ====================================================

-- 1. USERS
INSERT INTO users (user_id, name, email, password_hash, role, profile_image, status, created_at)
VALUES
('usr_admin', 'Campus Administrator', 'admin@lostandfound.edu', 'hashed_admin123', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'active', '2026-09-01T08:00:00Z'),
('usr_sarah', 'Sarah Connor', 'student@lostandfound.edu', 'hashed_student123', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'active', '2026-09-10T10:30:00Z'),
('usr_david', 'David Miller', 'finder@lostandfound.edu', 'hashed_finder123', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'active', '2026-09-12T14:15:00Z');

-- 2. SAMPLE ITEMS
INSERT INTO items (item_id, user_id, type, item_name, category, description, location, date, time, additional_details, image_url, contact_preference, status, created_at)
VALUES
(
  'item_lost_wallet',
  'usr_sarah',
  'lost',
  'Black Leather Wallet',
  'Wallet',
  'Black bifold leather wallet containing student card and library pass. Lost while studying near the 2nd floor silent reading zone.',
  'College Library',
  '2026-09-20',
  '14:30',
  'Has a subtle stitch tear on the left corner flap.',
  '/src/assets/images/item_leather_wallet_1790648969602.jpg',
  'in_app',
  'potential_match',
  '2026-09-20T15:00:00Z'
),
(
  'item_found_wallet',
  'usr_david',
  'found',
  'Black Leather Bifold Wallet',
  'Wallet',
  'Found a black leather wallet under the wooden desks on the 2nd floor. Kept safely with desk supervisor.',
  'College Library',
  '2026-09-20',
  '17:00',
  'Contains cards. Genuine owner must specify the cards inside.',
  '/src/assets/images/item_leather_wallet_1790648969602.jpg',
  'in_app',
  'potential_match',
  '2026-09-20T17:15:00Z'
),
(
  'item_lost_backpack',
  'usr_sarah',
  'lost',
  'Blue Canvas Backpack',
  'Bags',
  'Navy blue Herschel-style canvas backpack with brown leather strap pulls. Has my notebook and water bottle.',
  'Student Center Bus Stop',
  '2026-09-22',
  '09:15',
  'Keychain of a silver star attached to the top zip.',
  '/src/assets/images/item_blue_backpack_1790648983361.jpg',
  'in_app',
  'active',
  '2026-09-22T10:00:00Z'
),
(
  'item_found_phone',
  'usr_david',
  'found',
  'Samsung Galaxy Smartphone',
  'Electronics',
  'Dark gray Samsung Galaxy phone with a clear protective bumper case found on cafeteria table 4 after lunch rush.',
  'Cafeteria Main Hall',
  '2026-09-25',
  '13:10',
  'Lock screen has an abstract wallpaper. Turned in at front security desk.',
  '/src/assets/images/item_smartphone_1790648994956.jpg',
  'in_app',
  'active',
  '2026-09-25T13:45:00Z'
);

-- 3. POTENTIAL MATCH
INSERT INTO matches (match_id, lost_item_id, found_item_id, similarity_score, match_reason, status, created_at)
VALUES
(
  'match_wallet_001',
  'item_lost_wallet',
  'item_found_wallet',
  88,
  'Strong similarity: Category (Wallet), matching location (College Library), same incident date (Sep 20), and consistent description keywords ("black leather wallet").',
  'suggested',
  '2026-09-20T17:20:00Z'
);

-- 4. NOTIFICATIONS
INSERT INTO notifications (notification_id, user_id, title, message, type, link, is_read, created_at)
VALUES
(
  'notif_001',
  'usr_sarah',
  'Potential match found for your lost wallet',
  'A "Black Leather Bifold Wallet" found at College Library on Sep 20 matches your report with an 88% similarity estimate.',
  'match_found',
  '/matches',
  false,
  '2026-09-20T17:21:00Z'
);
