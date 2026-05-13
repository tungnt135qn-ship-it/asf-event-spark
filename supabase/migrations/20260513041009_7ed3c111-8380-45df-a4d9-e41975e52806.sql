
-- ============================================
-- 1. ENUM cho roles
-- ============================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'event_admin', 'editor');

-- ============================================
-- 2. Bảng events
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name JSONB NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  tagline JSONB NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  location JSONB NOT NULL DEFAULT '{"vi":"","en":""}'::jsonb,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  default_lang TEXT NOT NULL DEFAULT 'vi' CHECK (default_lang IN ('vi','en')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  cover_url TEXT,
  logo_url TEXT,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX events_only_one_default
  ON public.events ((TRUE)) WHERE is_default = TRUE;

-- ============================================
-- 3. Bảng profiles
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 4. Bảng user_roles
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- super_admin không gắn event; event_admin/editor BẮT BUỘC gắn event
  CHECK (
    (role = 'super_admin' AND event_id IS NULL)
    OR (role IN ('event_admin','editor') AND event_id IS NOT NULL)
  ),
  UNIQUE (user_id, role, event_id)
);

CREATE INDEX user_roles_user_id_idx ON public.user_roles(user_id);
CREATE INDEX user_roles_event_id_idx ON public.user_roles(event_id);

-- ============================================
-- 5. Security definer function: has_role
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID,
  _role public.app_role,
  _event_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (
        _event_id IS NULL
        OR event_id IS NULL  -- super_admin matches any event
        OR event_id = _event_id
      )
  )
$$;

-- Helper: kiểm tra ai có quyền quản trị 1 event (super_admin HOẶC event_admin của event đó)
CREATE OR REPLACE FUNCTION public.can_manage_event(_user_id UUID, _event_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = 'super_admin'
        OR (role IN ('event_admin','editor') AND event_id = _event_id)
      )
  )
$$;

-- ============================================
-- 6. Trigger: tự tạo profile khi có user mới
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. Trigger: updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- 8. RLS
-- ============================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- events
CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can read all events"
  ON public.events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.can_manage_event(auth.uid(), id));

CREATE POLICY "Super admins insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins update their events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.can_manage_event(auth.uid(), id));

CREATE POLICY "Super admins delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- profiles
CREATE POLICY "Authenticated read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- user_roles
CREATE POLICY "Users read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- 9. Seed event ASF 2026 (default)
-- ============================================
INSERT INTO public.events (slug, name, tagline, location, start_at, end_at, status, is_default, default_lang)
VALUES (
  'asf-2026',
  '{"vi":"Diễn đàn Chứng khoán Châu Á 2026","en":"Asian Securities Forum 2026"}'::jsonb,
  '{"vi":"Hà Nội, 1–4 tháng 10, 2026","en":"Hanoi, 1–4 October 2026"}'::jsonb,
  '{"vi":"Khách sạn Meliá Hà Nội","en":"Meliá Hanoi Hotel"}'::jsonb,
  '2026-10-01 09:00:00+07',
  '2026-10-04 18:00:00+07',
  'published',
  TRUE,
  'vi'
);
