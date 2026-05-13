/*
  # Create lesson_progress table

  ## Purpose
  Persists lesson completion data per authenticated user, keyed by lesson index.

  ## New Tables
  - `lesson_progress`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `lesson_index` (integer, the index of the completed lesson in the LESSONS array)
    - `completed_at` (timestamptz)

  ## Security
  - RLS enabled
  - Users can only read and insert their own rows
  - Unique constraint on (user_id, lesson_index) to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_index integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_index)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
