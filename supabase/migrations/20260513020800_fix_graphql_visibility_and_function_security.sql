/*
  # Fix GraphQL schema visibility and SECURITY DEFINER function exposure

  ## Issues resolved (all 10)

  ### GraphQL visibility — anon role (3 issues)
  Revoke SELECT from anon on lesson_progress, user_profiles, waitlist.
  Tables are hidden from the GraphQL schema for unauthenticated requests.

  ### GraphQL visibility — authenticated role (3 issues)
  Revoke overly-broad SELECT from authenticated on user_profiles and waitlist.
  lesson_progress stays SELECT-accessible to authenticated but only via RLS
  (users see only their own rows). user_profiles and waitlist should not be
  browsable by every signed-in user.

  ### SECURITY DEFINER functions callable by anon (2 issues)
  Revoke EXECUTE on handle_new_user() and has_completed_difficulty() from anon.
  handle_new_user is a trigger function — it must never be callable via REST.
  has_completed_difficulty should only be callable by authenticated users.

  ### SECURITY DEFINER functions callable by authenticated (2 issues)
  Revoke EXECUTE on handle_new_user() from authenticated.
  has_completed_difficulty() remains EXECUTE for authenticated (it's a
  legitimate helper for signed-in users checking their own progress), but
  the body already gates on p_user_id so cross-user abuse is prevented.

  ## Privilege strategy after this migration
  - lesson_progress:  anon=INSERT only (waitlist sign-up path), authenticated=SELECT+INSERT (own rows via RLS)
  - user_profiles:    anon=none, authenticated=SELECT (own row via RLS)
  - waitlist:         anon=INSERT only, authenticated=INSERT only
  - handle_new_user:  EXECUTE revoked from anon + authenticated (trigger-only)
  - has_completed_difficulty: EXECUTE revoked from anon, kept for authenticated
*/

-- ─── lesson_progress ────────────────────────────────────────────────────────
REVOKE ALL ON public.lesson_progress FROM anon;
REVOKE ALL ON public.lesson_progress FROM authenticated;

-- anon needs no access (lesson progress requires auth)
-- authenticated needs SELECT + INSERT for their own rows (RLS enforces ownership)
GRANT SELECT, INSERT ON public.lesson_progress TO authenticated;

-- ─── user_profiles ──────────────────────────────────────────────────────────
REVOKE ALL ON public.user_profiles FROM anon;
REVOKE ALL ON public.user_profiles FROM authenticated;

-- authenticated users can read their own profile (RLS enforces this)
GRANT SELECT ON public.user_profiles TO authenticated;

-- ─── waitlist ────────────────────────────────────────────────────────────────
REVOKE ALL ON public.waitlist FROM anon;
REVOKE ALL ON public.waitlist FROM authenticated;

-- anon can INSERT to join the waitlist (existing public flow)
-- authenticated can also INSERT but neither role should SELECT all rows
GRANT INSERT ON public.waitlist TO anon;
GRANT INSERT ON public.waitlist TO authenticated;

-- ─── handle_new_user() ───────────────────────────────────────────────────────
-- This is a trigger function; it should never be invocable via REST by anyone.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- ─── has_completed_difficulty() ──────────────────────────────────────────────
-- anon should never call this; authenticated users may legitimately call it.
REVOKE EXECUTE ON FUNCTION public.has_completed_difficulty(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_completed_difficulty(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_completed_difficulty(uuid, text) TO authenticated;
