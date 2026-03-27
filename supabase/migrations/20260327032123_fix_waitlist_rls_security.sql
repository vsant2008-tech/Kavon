/*
  # Fix Waitlist RLS Security Issue

  1. Changes
    - Drop the overly permissive "Anyone can join the waitlist" policy
    - Create a new policy that validates email format before allowing INSERT
    - This prevents spam and ensures only valid emails can be added

  2. Security Improvements
    - Email must match a valid email pattern (contains @ and .)
    - Email must be at least 5 characters long
    - Email must not be empty or whitespace only
    - Still allows public access for legitimate signups
*/

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Anyone can join the waitlist" ON waitlist;

-- Create a new policy with email validation
CREATE POLICY "Allow valid email signups"
  ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND length(trim(email)) >= 5
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );