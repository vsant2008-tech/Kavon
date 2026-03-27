/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each waitlist entry
      - `email` (text, unique, not null) - Email address of the user joining the waitlist
      - `created_at` (timestamptz, default now()) - Timestamp when the user joined the waitlist

  2. Security
    - Enable RLS on `waitlist` table
    - Add policy to allow anyone to insert their email (public access for signup)
    - Add policy to allow authenticated users to view all waitlist entries (for admin purposes)

  3. Indexes
    - Add unique index on email to prevent duplicate entries
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
  ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);