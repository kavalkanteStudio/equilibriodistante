-- Add catalog orientation and provenance fields before building artwork CRUD.
ALTER TABLE public.artworks
  ADD COLUMN IF NOT EXISTS orientation TEXT NOT NULL DEFAULT 'a3-vertical',
  ADD COLUMN IF NOT EXISTS license_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS license_type TEXT,
  ADD COLUMN IF NOT EXISTS license_source_url TEXT,
  ADD COLUMN IF NOT EXISTS license_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS credit_required BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS credit_text TEXT,
  ADD COLUMN IF NOT EXISTS source_tool TEXT,
  ADD COLUMN IF NOT EXISTS source_plan TEXT;

ALTER TABLE public.artworks
  DROP CONSTRAINT IF EXISTS artworks_orientation_check,
  ADD CONSTRAINT artworks_orientation_check
    CHECK (orientation IN ('a3-vertical', 'a3-wide')),
  DROP CONSTRAINT IF EXISTS artworks_license_status_check,
  ADD CONSTRAINT artworks_license_status_check
    CHECK (license_status IN ('pending', 'approved', 'rejected'));

COMMENT ON COLUMN public.artworks.orientation IS 'Catalog format: A3 vertical or A3 wide.';
COMMENT ON COLUMN public.artworks.license_status IS 'Internal review state for commercial publication.';
COMMENT ON COLUMN public.artworks.license_source_url IS 'URL used to verify the applicable license or terms.';