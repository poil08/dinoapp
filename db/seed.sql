-- Seed users table with 4 rows
INSERT INTO users (name, email, username) VALUES
  ('Alex Rivera', 'alex.rivera@example.com', 'alex.rivera'),
  ('Jordan Kim', 'jordan.kim@example.com', 'jordan.kim'),
  ('Sam Chen', 'sam.chen@example.com', 'sam.chen'),
  ('Morgan Taylor', 'morgan.taylor@example.com', 'morgan.taylor')
ON CONFLICT (email) DO NOTHING;
