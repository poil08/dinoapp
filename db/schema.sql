-- Create users table for Dino Camp Roster
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  username   VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
