/*
  # Add Admin Role and User Progress Tracking

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_ticker` (text)
      - `lesson_module` (text) - 'day' or 'long'
      - `difficulty` (text) - 'beginner', 'intermediate', 'advanced'
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Admin users (vsant2008@gmail.com) can access all lessons without restrictions
    - Regular users must complete all beginner lessons before accessing intermediate
    - Regular users must complete all intermediate lessons before accessing advanced
    - Users can read their own profile and progress
    - Users can update their own progress

  3. Functions
    - Trigger function to create user profile on signup
    - Function to check if user has completed all lessons of a difficulty level
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_ticker text NOT NULL,
  lesson_module text NOT NULL,
  difficulty text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_ticker, lesson_module)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for lesson_progress
CREATE POLICY "Users can read own progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, is_admin)
  VALUES (
    new.id,
    new.email,
    CASE WHEN new.email = 'vsant2008@gmail.com' THEN true ELSE false END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Function to check if user completed all lessons of a difficulty
CREATE OR REPLACE FUNCTION public.has_completed_difficulty(
  p_user_id uuid,
  p_difficulty text
)
RETURNS boolean AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO v_is_admin
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Admins have access to everything
  IF v_is_admin THEN
    RETURN true;
  END IF;
  
  -- For regular users, check completion (this is a placeholder - 
  -- actual logic will be in the frontend based on lesson data)
  RETURN EXISTS (
    SELECT 1
    FROM lesson_progress
    WHERE user_id = p_user_id
      AND difficulty = p_difficulty
      AND completed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_difficulty ON lesson_progress(user_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
