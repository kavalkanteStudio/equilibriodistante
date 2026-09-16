-- Simplify product variants: one product price, named options, SKU and stock.
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS name TEXT;

UPDATE public.product_variants
SET name = NULLIF(
  concat_ws(' - ', NULLIF(size, ''), NULLIF(color, '')),
  ''
)
WHERE name IS NULL;

UPDATE public.product_variants
SET name = 'Variante ' || left(id::text, 8)
WHERE name IS NULL;

ALTER TABLE public.product_variants
  ALTER COLUMN name SET NOT NULL,
  DROP COLUMN IF EXISTS size,
  DROP COLUMN IF EXISTS color,
  DROP COLUMN IF EXISTS price;

ALTER TABLE public.product_variants
  ALTER COLUMN stock_quantity SET DEFAULT 0,
  ADD CONSTRAINT product_variants_stock_nonnegative CHECK (stock_quantity >= 0);
