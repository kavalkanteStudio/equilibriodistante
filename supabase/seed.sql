-- =============================================================================
-- SEED DATA FOR DECORATIVE ART STORE
-- =============================================================================

-- We use DO blocks or CTEs to handle IDs across tables easily.

DO $$
DECLARE
    coll_nature_id UUID;
    coll_abstract_id UUID;
    art_fern_id UUID;
    art_prism_id UUID;
    prod_print_id UUID;
    prod_canvas_id UUID;
BEGIN
    -- 1. SEED COLLECTIONS
    INSERT INTO public.collections (slug, name, description, status, published_at)
    VALUES ('natures-whisper', 'Nature''s Whisper', 'A serene exploration of botanical forms and organic textures.', 'published', now())
    RETURNING id INTO coll_nature_id;

    INSERT INTO public.collections (slug, name, description, status, published_at)
    VALUES ('neon-geometry', 'Neon Geometry', 'Bold shapes and vibrant colors exploring the intersection of math and art.', 'published', now())
    RETURNING id INTO coll_abstract_id;

    -- 2. SEED ARTWORKS
    -- Artwork for Nature's Whisper
    INSERT INTO public.artworks (collection_id, title, slug, prompt_summary, source_model, published, final_image_url)
    VALUES (coll_nature_id, 'Emerald Fern', 'emerald-fern', 'Hyper-realistic macro of a fern leaf with dew drops, soft bokeh background, emerald greens.', 'Leonardo-XL', true, 'https://images.unsplash.com/photo-1501004318641-b39e64516aee?q=80&w=1000')
    RETURNING id INTO art_fern_id;

    -- Artwork for Neon Geometry
    INSERT INTO public.artworks (collection_id, title, slug, prompt_summary, source_model, published, final_image_url)
    VALUES (coll_abstract_id, 'Prism Shift', 'prism-shift', 'Abstract geometric composition, neon pink and cyan gradients, sharp angles, 8k resolution.', 'Midjourney-v6', true, 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000')
    RETURNING id INTO art_prism_id;

    -- 3. SEED PRODUCTS
    -- Product for Emerald Fern
    INSERT INTO public.products (artwork_id, product_type, title, description, base_price, active)
    VALUES (art_fern_id, 'Fine Art Print', 'Emerald Fern - Museum Quality Print', 'Printed on 300gsm archival paper with pigment inks.', 49.99, true)
    RETURNING id INTO prod_print_id;

    -- Product for Prism Shift
    INSERT INTO public.products (artwork_id, product_type, title, description, base_price, active)
    VALUES (art_prism_id, 'Canvas Print', 'Prism Shift - Gallery Wrapped Canvas', 'High-definition canvas stretched over a wooden frame.', 89.99, true)
    RETURNING id INTO prod_canvas_id;

    -- 4. SEED PRODUCT VARIANTS
    -- Variants for Fine Art Print (Emerald Fern)
    INSERT INTO public.product_variants (product_id, size, sku, stock_quantity, price)
    VALUES
    (prod_print_id, 'A4', 'EF-PRINT-A4', 50, 49.99),
    (prod_print_id, 'A3', 'EF-PRINT-A3', 30, 79.99);

    -- Variants for Canvas Print (Prism Shift)
    INSERT INTO public.product_variants (product_id, size, sku, stock_quantity, price)
    VALUES
    (prod_canvas_id, 'Medium (40x60)', 'PS-CANVAS-M', 20, 89.99),
    (prod_canvas_id, 'Large (60x90)', 'PS-CANVAS-L', 10, 149.99);

END $$;
