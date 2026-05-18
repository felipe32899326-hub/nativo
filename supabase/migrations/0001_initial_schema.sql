-- ============================================================
-- Nativo — Initial Schema
-- ============================================================

-- plans (reference/seed data)
CREATE TABLE public.plans (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  plays_limit  integer NOT NULL,
  videos_limit integer NOT NULL,
  trial_days   integer,
  is_active    boolean NOT NULL DEFAULT true
);

INSERT INTO public.plans (id, name, plays_limit, videos_limit, trial_days) VALUES
  ('trial',    'Trial',    1500,  10,  7),
  ('free',     'Free',     1500,  10,  null),
  ('pro',      'Pro',      50000, 100, null),
  ('business', 'Business', -1,    -1,  null);

-- profiles (1:1 with auth.users)
CREATE TABLE public.profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          text NOT NULL,
  full_name      text,
  avatar_url     text,
  role           text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_blocked     boolean NOT NULL DEFAULT false,
  plan_id        text NOT NULL DEFAULT 'trial' REFERENCES public.plans(id),
  trial_ends_at  timestamptz,
  plays_used     integer NOT NULL DEFAULT 0,
  plays_limit    integer NOT NULL DEFAULT 1500,
  videos_limit   integer NOT NULL DEFAULT 10,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- videos
CREATE TABLE public.videos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            text NOT NULL,
  description      text,
  bunny_video_id   text UNIQUE,
  bunny_library_id text,
  bunny_status     integer NOT NULL DEFAULT 0,
  playback_url     text,
  thumbnail_url    text,
  preview_url      text,
  duration_seconds integer,
  player_config    jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published     boolean NOT NULL DEFAULT false,
  is_deleted       boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_videos_user_id       ON public.videos(user_id);
CREATE INDEX idx_videos_bunny_id      ON public.videos(bunny_video_id);
CREATE INDEX idx_videos_published     ON public.videos(is_published) WHERE is_deleted = false;

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own videos"
  ON public.videos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Published videos are public (embed)"
  ON public.videos FOR SELECT
  USING (is_published = true AND is_deleted = false);

CREATE POLICY "Admins can manage all videos"
  ON public.videos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- play_sessions
CREATE TABLE public.play_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id     uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  session_id   text NOT NULL,
  viewer_id    text,
  embed_origin text,
  device_type  text CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  country_code text,
  started_at   timestamptz NOT NULL DEFAULT now(),
  ended_at     timestamptz,
  watch_seconds integer NOT NULL DEFAULT 0,
  completed    boolean NOT NULL DEFAULT false,
  segments_data jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (video_id, session_id)
);

CREATE INDEX idx_play_sessions_video_id   ON public.play_sessions(video_id);
CREATE INDEX idx_play_sessions_started_at ON public.play_sessions(started_at);

ALTER TABLE public.play_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read sessions for own videos"
  ON public.play_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.videos v
      WHERE v.id = video_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all sessions"
  ON public.play_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- cta_events
CREATE TABLE public.cta_events (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id           uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  session_id         text NOT NULL,
  cta_index          integer NOT NULL,
  cta_url            text,
  clicked_at_second  integer,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cta_events_video_id ON public.cta_events(video_id);

ALTER TABLE public.cta_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read CTA events for own videos"
  ON public.cta_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.videos v
      WHERE v.id = video_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all CTA events"
  ON public.cta_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    now() + interval '7 days'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Increment plays_used when a new play session is created
CREATE OR REPLACE FUNCTION public.increment_plays_used()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET plays_used = plays_used + 1
  WHERE id = (
    SELECT user_id FROM public.videos WHERE id = NEW.video_id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_play_session_created
  AFTER INSERT ON public.play_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_plays_used();
