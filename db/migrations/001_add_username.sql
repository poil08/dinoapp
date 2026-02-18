-- Add username column and backfill from email (run this if you already have the users table)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);
UPDATE users SET username = split_part(email, '@', 1) WHERE username IS NULL OR username = '';
