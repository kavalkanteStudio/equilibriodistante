-- Migration: Consolidate tool-specific URLs into a single source_url
-- Target: artworks table

-- 1. Add the unified source_url column
ALTER TABLE public.artworks 
ADD COLUMN source_url TEXT;

-- 2. Migrate existing data
-- If civitai_url is present, use it; otherwise use leonardo_url
UPDATE public.artworks 
SET source_url = COALESCE(civitai_url, leonardo_url);

-- 3. Remove the old columns
ALTER TABLE public.artworks 
DROP COLUMN civitai_url, 
DROP COLUMN leonardo_url;

-- 4. Ensure the Data API still has access (pre-emptive for Oct 30th change)
-- Note: For existing tables it's already granted, but we apply it to be explicit
GRANT ALL ON TABLE public.artworks TO authenticated, service_role;
GRANT ALL ON TABLE public.artworks TO anon;
