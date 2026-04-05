/*
  # Fix RLS Performance and Security Issues

  1. Performance Improvements
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale

  2. Security Improvements
    - Add explicit search_path to functions to prevent search_path attacks
    - Set search_path to empty string with explicit schema references

  3. Changes Made
    - Drop and recreate all RLS policies with optimized syntax
    - Update function definitions with secure search_path
    - Keep indexes as they will be used when data grows
*/

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON lesson_progress;

-- Recreate user_profiles policies with optimized syntax
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Recreate lesson_progress policies with optimized syntax
CREATE POLICY "Users can read own progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own progress"
  ON lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own progress"
  ON lesson_progress
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Update handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, is_admin)
  VALUES (
    new.id,
    new.email,
    CASE WHEN new.email = 'vsant2008@gmail.com' THEN true ELSE false END
  );
  RETURN new;
END;
$$;

-- Update has_completed_difficulty function with secure search_path
CREATE OR REPLACE FUNCTION public.has_completed_difficulty(
  p_user_id uuid,
  p_difficulty text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO v_is_admin
  FROM public.user_profiles
  WHERE id = p_user_id;
  
  -- Admins have access to everything
  IF v_is_admin THEN
    RETURN true;
  END IF;
  
  -- For regular users, check completion
  RETURN EXISTS (
    SELECT 1
    FROM public.lesson_progress
    WHERE user_id = p_user_id
      AND difficulty = p_difficulty
      AND completed = true
  );
END;
$$;
