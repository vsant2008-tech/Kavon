/*
  # Deduplicate RLS policies on lesson_progress

  ## Problem
  lesson_progress has duplicate policies created by two separate migrations:
  - "Users can read own lesson progress" and "Users can read own progress" (both SELECT)
  - "Users can insert own lesson progress" and "Users can insert own progress" (both INSERT)

  Having duplicate policies for the same command and role is redundant and can
  cause confusion during audits. Drop the older duplicates and keep the
  consistently-named ones.

  ## No changes to user_profiles
  user_profiles policies are clean — one policy per command, all correct.

  ## Security posture unchanged
  Both tables retain RLS enabled with auth.uid() ownership checks on all operations.
*/

-- Drop the older duplicate policies on lesson_progress
DROP POLICY IF EXISTS "Users can read own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.lesson_progress;
