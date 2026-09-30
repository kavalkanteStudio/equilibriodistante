CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin contact messages read" ON public.contact_messages;
CREATE POLICY "Admin contact messages read" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin contact messages delete" ON public.contact_messages;
CREATE POLICY "Admin contact messages delete" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin orders read" ON public.orders;
CREATE POLICY "Admin orders read" ON public.orders
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin orders delete" ON public.orders;
CREATE POLICY "Admin orders delete" ON public.orders
  FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin order items read" ON public.order_items;
CREATE POLICY "Admin order items read" ON public.order_items
  FOR SELECT TO authenticated USING (public.is_admin());