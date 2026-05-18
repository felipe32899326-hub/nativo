-- Fix infinite recursion in admin RLS policies
-- The original policies queried `profiles` inside policies for `profiles`,
-- causing PostgreSQL error 42P17 (infinite recursion detected).
-- We replace them with a SECURITY DEFINER function that bypasses RLS during the admin check.

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can read all sessions" ON public.play_sessions;
DROP POLICY IF EXISTS "Admins can read all CTA events" ON public.cta_events;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$;

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage all videos"
  ON public.videos FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can read all sessions"
  ON public.play_sessions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can read all CTA events"
  ON public.cta_events FOR ALL
  USING (public.is_admin());
