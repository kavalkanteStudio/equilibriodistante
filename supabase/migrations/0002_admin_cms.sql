-- Admin foundation for the catalog CMS.
-- Grant the admin role through Supabase Auth app_metadata, never user_metadata.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Admin collections manage" ON public.collections;
CREATE POLICY "Admin collections manage" ON public.collections
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin artworks manage" ON public.artworks;
CREATE POLICY "Admin artworks manage" ON public.artworks
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin products manage" ON public.products;
CREATE POLICY "Admin products manage" ON public.products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin product variants manage" ON public.product_variants;
CREATE POLICY "Admin product variants manage" ON public.product_variants
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public artworks storage read" ON storage.objects;
CREATE POLICY "Public artworks storage read" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

DROP POLICY IF EXISTS "Admin artworks storage insert" ON storage.objects;
CREATE POLICY "Admin artworks storage insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artworks' AND public.is_admin());

DROP POLICY IF EXISTS "Admin artworks storage update" ON storage.objects;
CREATE POLICY "Admin artworks storage update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'artworks' AND public.is_admin())
  WITH CHECK (bucket_id = 'artworks' AND public.is_admin());

DROP POLICY IF EXISTS "Admin artworks storage delete" ON storage.objects;
CREATE POLICY "Admin artworks storage delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'artworks' AND public.is_admin());
