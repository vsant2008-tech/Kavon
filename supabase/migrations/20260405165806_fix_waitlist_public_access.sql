/*
  # Fix Waitlist Public Access

  1. Changes
    - Update RLS policy to allow public (anon) inserts into waitlist
    - Keep email validation for security
    - Allow anyone to join the waitlist, but admin email redirects to login

  2. Security
    - Email validation remains in place
    - RLS still prevents unauthorized access
*/

DROP POLICY IF EXISTS "Allow valid email signups" ON waitlist;

CREATE POLICY "Public can join waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (
    email IS NOT NULL 
    AND length(trim(email)) >= 5
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
