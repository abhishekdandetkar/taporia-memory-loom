
-- Roles enum + table (security definer pattern)
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pendant_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  amount_inr INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_provider TEXT,
  payment_reference TEXT,
  order_status TEXT NOT NULL DEFAULT 'placed', -- placed, crafting, shipped, delivered
  memory_status TEXT NOT NULL DEFAULT 'awaiting', -- awaiting, uploaded, crafted
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Reservations (Founders Edition waitlist)
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, contacted, converted, dropped
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Corporate leads
CREATE TABLE public.corporate_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  employees TEXT,
  use_case TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Support tickets
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  order_id TEXT,
  category TEXT NOT NULL DEFAULT 'general', -- general, order, delivery, memory
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CMS content (key/value with rich JSON)
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  body JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER cms_updated_at BEFORE UPDATE ON public.cms_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Memory pages (per pendant)
CREATE TABLE public.memory_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pendant_code TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  title TEXT,
  story TEXT,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER memory_pages_updated_at BEFORE UPDATE ON public.memory_pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_pages ENABLE ROW LEVEL SECURITY;

-- Profiles: user sees/updates own; admin all
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles: only admins can read/manage; users can read own roles
CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Orders: anyone can create; user sees own; admin all
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_self_select" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders_admin_delete" ON public.orders FOR DELETE USING (public.has_role(auth.uid(),'admin'));

-- Reservations: public insert; admin read
CREATE POLICY "res_public_insert" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "res_admin_all" ON public.reservations FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Corporate leads: public insert; admin read
CREATE POLICY "leads_public_insert" ON public.corporate_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_admin_all" ON public.corporate_leads FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Support tickets: public insert; admin manage
CREATE POLICY "tickets_public_insert" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "tickets_admin_all" ON public.support_tickets FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- CMS content: public read; admin write
CREATE POLICY "cms_public_read" ON public.cms_content FOR SELECT USING (true);
CREATE POLICY "cms_admin_write" ON public.cms_content FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Memory pages: published readable by anyone; admin manage
CREATE POLICY "mem_published_read" ON public.memory_pages FOR SELECT USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "mem_admin_all" ON public.memory_pages FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Storage bucket for memory media
INSERT INTO storage.buckets (id, name, public) VALUES ('memories', 'memories', true);

CREATE POLICY "memories_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'memories');
CREATE POLICY "memories_admin_write" ON storage.objects FOR ALL USING (bucket_id = 'memories' AND public.has_role(auth.uid(),'admin')) WITH CHECK (bucket_id = 'memories' AND public.has_role(auth.uid(),'admin'));
