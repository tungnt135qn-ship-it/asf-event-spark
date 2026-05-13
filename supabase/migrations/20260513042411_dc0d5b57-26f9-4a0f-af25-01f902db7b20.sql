
-- =====================================================================
-- Mốc 2: Schema toàn bộ nội dung + RLS
-- =====================================================================

-- Trigger tạo profile khi có user mới
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: kiểm tra event đã publish (cho RLS public read)
CREATE OR REPLACE FUNCTION public.event_is_published(_event_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.events WHERE id = _event_id AND status = 'published')
$$;

-- =====================================================================
-- Bảng cấu hình & nội dung
-- =====================================================================

CREATE TABLE public.event_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  contact jsonb NOT NULL DEFAULT '{}'::jsonb,
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  footer_text jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  registration_enabled boolean NOT NULL DEFAULT true,
  booking_enabled boolean NOT NULL DEFAULT true,
  library_locked boolean NOT NULL DEFAULT false,
  documents_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  tagline jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  lead jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  date_text jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  location_text jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  cta_register_label jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  cta_agenda_label jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  background_url text,
  countdown_to timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.overview_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  eyebrow jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  lead jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  orgs_title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  orgs jsonb NOT NULL DEFAULT '[]'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.why_attend_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  icon text,
  stat text,
  stat_label jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  description jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.key_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  body jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  slug text NOT NULL,
  position int NOT NULL DEFAULT 0,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  summary jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  long_description jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  highlights jsonb NOT NULL DEFAULT '{"vi":[],"en":[]}'::jsonb,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  content_blocks jsonb NOT NULL DEFAULT '{"vi":[],"en":[]}'::jsonb,
  image_url text,
  abbr text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, slug)
);

CREATE TABLE public.speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  external_id text,
  position int NOT NULL DEFAULT 0,
  full_name text NOT NULL,
  honorific text,
  role jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  organization jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  bio jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  avatar_url text,
  socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  topic_slugs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, external_id)
);

CREATE TABLE public.agenda_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position int NOT NULL,
  date date NOT NULL,
  label jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  topic_slugs jsonb NOT NULL DEFAULT '[]'::jsonb,
  speaker_external_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, position)
);

CREATE TABLE public.agenda_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  day_id uuid NOT NULL REFERENCES public.agenda_days(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  time_text text NOT NULL,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  description jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  location jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  tag text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  external_id text,
  position int NOT NULL DEFAULT 0,
  name text NOT NULL,
  tier jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  address jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  description jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  perks jsonb NOT NULL DEFAULT '{"vi":[],"en":[]}'::jsonb,
  contact jsonb NOT NULL DEFAULT '{}'::jsonb,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  map_url text,
  website_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, external_id)
);

CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  slug text NOT NULL,
  position int NOT NULL DEFAULT 0,
  tag text,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  excerpt jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  body jsonb NOT NULL DEFAULT '{"vi":[],"en":[]}'::jsonb,
  cover_url text,
  author text,
  read_time text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, slug)
);

CREATE TABLE public.press_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  description jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  source text,
  url text,
  file_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  category jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  question jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  answer jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE public.sponsor_tier AS ENUM ('diamond','platinum','gold','silver','bronze','partner');

CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  tier public.sponsor_tier NOT NULL DEFAULT 'partner',
  position int NOT NULL DEFAULT 0,
  name text NOT NULL,
  logo_url text,
  website_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  name jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  description jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  file_url text,
  file_type text,
  file_size text,
  requires_code boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE public.library_media_type AS ENUM ('photo','video');

CREATE TABLE public.library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  external_id text,
  position int NOT NULL DEFAULT 0,
  type public.library_media_type NOT NULL,
  day_index int,
  title jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  thumbnail_url text NOT NULL,
  source_url text NOT NULL,
  requires_code boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- Vận hành
-- =====================================================================

CREATE TYPE public.access_code_scope AS ENUM ('all','registration','library','document');

CREATE TABLE public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  code text NOT NULL,
  label jsonb NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  scope public.access_code_scope NOT NULL DEFAULT 'all',
  max_uses int,
  used_count int NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, code)
);

CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  access_code text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country_code text,
  nationality text,
  organization text,
  job_title text,
  customer_type text,
  passport_url text,
  language text,
  notes text,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE SET NULL,
  hotel_name text,
  access_code text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  rooms int,
  room_type text,
  guests int,
  check_in date,
  check_out date,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- Triggers updated_at
-- =====================================================================

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'event_settings','hero_content','overview_content','why_attend_items','key_contents',
    'topics','speakers','agenda_days','agenda_sessions','hotels','news','press_releases',
    'faqs','sponsors','documents','library_items','access_codes','registrations','bookings'
  ]) LOOP
    EXECUTE format($f$
      CREATE TRIGGER trg_%1$s_updated_at
      BEFORE UPDATE ON public.%1$s
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    $f$, t);
  END LOOP;
END $$;

-- =====================================================================
-- RLS - bật và policies
-- =====================================================================

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'event_settings','hero_content','overview_content','why_attend_items','key_contents',
    'topics','speakers','agenda_days','agenda_sessions','hotels','news','press_releases',
    'faqs','sponsors','documents','library_items','access_codes','registrations','bookings'
  ]) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

-- Public read cho các bảng nội dung (chỉ khi event published)
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'event_settings','hero_content','overview_content','why_attend_items','key_contents',
    'topics','speakers','agenda_days','agenda_sessions','hotels','news','press_releases',
    'faqs','sponsors','documents','library_items'
  ]) LOOP
    EXECUTE format($f$
      CREATE POLICY "Public read published" ON public.%1$s
      FOR SELECT TO anon, authenticated
      USING (public.event_is_published(event_id));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "Admin read all" ON public.%1$s
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "Admin insert" ON public.%1$s
      FOR INSERT TO authenticated
      WITH CHECK (public.can_manage_event(auth.uid(), event_id));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "Admin update" ON public.%1$s
      FOR UPDATE TO authenticated
      USING (public.can_manage_event(auth.uid(), event_id))
      WITH CHECK (public.can_manage_event(auth.uid(), event_id));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "Admin delete" ON public.%1$s
      FOR DELETE TO authenticated
      USING (public.can_manage_event(auth.uid(), event_id));
    $f$, t);
  END LOOP;
END $$;

-- access_codes: KHÔNG cho public select. Chỉ admin.
CREATE POLICY "Admin manage access_codes" ON public.access_codes
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

-- registrations: anon insert nếu event published; admin đọc/sửa/xoá
CREATE POLICY "Public insert registration" ON public.registrations
FOR INSERT TO anon, authenticated
WITH CHECK (public.event_is_published(event_id));

CREATE POLICY "Admin read registrations" ON public.registrations
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

CREATE POLICY "Admin update registrations" ON public.registrations
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

CREATE POLICY "Admin delete registrations" ON public.registrations
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

-- bookings: tương tự
CREATE POLICY "Public insert booking" ON public.bookings
FOR INSERT TO anon, authenticated
WITH CHECK (public.event_is_published(event_id));

CREATE POLICY "Admin read bookings" ON public.bookings
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

CREATE POLICY "Admin update bookings" ON public.bookings
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

CREATE POLICY "Admin delete bookings" ON public.bookings
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.can_manage_event(auth.uid(), event_id));

-- Indexes
CREATE INDEX idx_topics_event ON public.topics(event_id, position);
CREATE INDEX idx_speakers_event ON public.speakers(event_id, position);
CREATE INDEX idx_agenda_days_event ON public.agenda_days(event_id, position);
CREATE INDEX idx_agenda_sessions_day ON public.agenda_sessions(day_id, position);
CREATE INDEX idx_hotels_event ON public.hotels(event_id, position);
CREATE INDEX idx_news_event ON public.news(event_id, position);
CREATE INDEX idx_faqs_event ON public.faqs(event_id, position);
CREATE INDEX idx_sponsors_event ON public.sponsors(event_id, tier, position);
CREATE INDEX idx_documents_event ON public.documents(event_id, position);
CREATE INDEX idx_library_event ON public.library_items(event_id, day_index, position);
CREATE INDEX idx_registrations_event ON public.registrations(event_id, submitted_at DESC);
CREATE INDEX idx_bookings_event ON public.bookings(event_id, submitted_at DESC);
CREATE INDEX idx_access_codes_lookup ON public.access_codes(event_id, code) WHERE active;
