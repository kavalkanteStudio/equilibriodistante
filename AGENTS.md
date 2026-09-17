# Project Specification: Decorative Art Web Store

This document serves as the master roadmap for the development of the decorative art web store. It translates the project briefing and requirements into actionable tasks.

## 🎯 Project Goal
Create a professional, scalable, and low-cost web presence for a decorative art business, focusing on a high-quality product catalog, secure serverless architecture, and strict legal compliance for AI-generated content.

## 🛠 Technical Stack
- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Hosting**: Vercel
- **Capability**: Progressive Web App (PWA)

## 🎨 Brand Identity & Design
- **Typography**:
  - Primary/Display: `Bricolage Grotesque` (Various weights/condensed)
  - Secondary/Accent: `Oswald`
  - Special: `Six Caps`
- **Design Principles**: Clean, professional, focused on visual art, accessible.

---

## 📋 Development Roadmap

### Phase 1: Foundation & Setup ✅
- [x] **Project Initialization**:
  - [x] Verify Vite + React + TS installation.
  - [x] Configure ESLint and Prettier.
  - [x] Setup `.gitignore` and `.env.example` (ensuring no secrets are committed).
- [x] **UI Base**:
  - [x] Install and configure Tailwind CSS.
  - [x] Initialize shadcn/ui.
  - [x] Setup global CSS and Tailwind theme (colors, spacing).
- [x] **Typography Integration**:
  - [x] Import and configure `Bricolage Grotesque`, `Oswald`, and `Six Caps`.
  - [x] Define typography scales in Tailwind config.

### Phase 2: Database Modeling & Security (Supabase) ✅
- [x] **Schema Design**:
  - [x] Create `collections` table (id, slug, name, description, cover_image, status, published_at).
  - [x] Create `artworks` table (id, collection_id, title, slug, prompt_summary, workflow_description, civitai_url, leonardo_url, license_notes, source_model, final_image_url, published).
  - [x] Create `products` table (id, artwork_id, product_type, title, description, base_price, active).
  - [x] Create `product_variants` table (id, product_id, size, color, sku, stock_quantity, price).
  - [x] Create `orders` table (id, customer_id, status, total_amount, payment_reference, shipping_reference).
  - [x] Create `order_items` table (id, order_id, product_variant_id, quantity, unit_price).
- [x] **Security & RLS**:
  - [x] Enable Row Level Security (RLS) on all tables.
  - [x] Create "Public Read" policy for `collections`, `artworks`, and `products` (where `active = true` or `published = true`).
  - [x] Create "User Own" policy for `orders` (where `customer_id = auth.uid()`).
- [x] **Storage**:
  - [x] Configure Supabase Storage buckets for artwork images and product previews.
  - [x] Setup public access policies for these buckets.

### Phase 3: Core Feature - Public Catalog ✅
- [x] **Catalog Routing**:
  - [x] Implement React Router for main pages: Home, Collections, Artwork Detail, Product Detail.
- [x] **Collection Gallery**:
  - [x] Build a page to list all active collections.
  - [x] Implement a a "Collection Detail" page showing all artworks in a collection.
- [x] **Artwork/Product Display**:
  - [x] Build a high-quality image gallery for artworks.
  - [x] Implement product selection (variants: size, color).
  - [x] Create a "Product Detail" view with pricing and description.
- [x] **State Management**:
  - [x] Integrate TanStack Query for efficient data fetching from Supabase.

### Phase 4 (Revised): Order Capture System ✅
- [x] **Order Logic**:
  - [x] Implement the "Place Order" logic: save the cart items into the `orders` and `order_items` tables in Supabase.
  - [x] Add a "Order Confirmed" success page.
  - [x] Ensure RLS policies allow users to create their own orders.
  - [x] (Optional) A simple admin view to see incoming orders.
- [x] **Checkout Flow**:
  - [x] Create a checkout form with validation (Zod + React Hook Form).
  - [x] Update "Pay Now" button to "Confirm Order".

### Phase 4.1: UI/UX Polishing & Branding ✅
- [x] **Global Layout**:
  - [x] Create `Header` component (Top Bar) with Logo, Navigation, and Cart Count.
  - [x] Create `Footer` component with professional links and copyright.
  - [x] Implement a `Layout` wrapper for all pages.
- [x] **Landing Page Experience**:
  - [x] Build a high-impact `Hero` section for the Home page.
  - [x] Refine Home page layout for luxury feel.
- [x] **Supporting Pages**:
  - [x] Create a minimal `About` page.
  - [x] Create a minimal `Contact` page.
  - [x] Create a curated `Collections` gallery page.

### Phase 4.2: Catalog Admin Foundation 🚧
- [x] **Admin Authentication**:
  - [x] Add Supabase Auth session handling for password and GitHub login.
  - [x] Protect `/admin` with `app_metadata.role = 'admin'`.
  - [x] Add `/admin/login` and `/admin` routes.
- [x] **Admin Security & Storage**:
  - [x] Add `supabase/migrations/0002_admin_cms.sql` with `is_admin()`, admin CRUD policies, and the `artworks` bucket.
  - [x] Keep Storage writes restricted to administrators and public reads limited to catalog assets.
- [x] **Collections CRUD**:
  - [x] Create, list, edit, publish/unpublish, and delete collections from the admin area.
- [x] **Manual Image Upload**:
  - [x] Add drag-and-drop/file-picker upload with Lucide icon and preview.
  - [x] Accept JPEG, PNG, and WebP up to 12 MB per file.
  - [x] Upload directly from the browser to Supabase Storage; keep direct image URLs as fallback.
- [x] **Remote Import Preparation**:
  - [x] Add `supabase/functions/import-artwork-image/index.ts` for public HTTPS image URLs.
  - [x] Validate administrator access, MIME type, private hosts, redirects, and a 12 MB download limit.
- [x] **Artwork Provenance Schema Preparation**:
  - [x] Add `supabase/migrations/0003_artwork_provenance.sql` with A3 orientation and license review fields.
- [x] **Artwork CRUD and Provenance**:
  - [x] Add CRUD for artworks, including `A3 vertical` and `A3 wide` orientation.
  - [x] Require approved license status before public publication.
  - [x] Record license verification timestamp when an artwork is approved.
  - [x] Add products and variants with the real `30x45` and `45x30` formats.
  - [ ] Connect manual upload and remote import to artwork records.
  - [ ] Add Storage cleanup when replacing or deleting catalog assets.

### Phase 4.3: Assisted Artwork Registration
- [ ] **Manual source context (current low-memory path)**:
  - [ ] Add a source URL field and a context textarea to the initial artwork form.
  - [ ] Allow the admin to paste selected text, HTML fragments, image URLs, prompts, and source links manually.
  - [ ] Keep manual copy-and-paste as a valid first-class workflow, without requiring a parser or external service.
  - [ ] Keep `license_notes`, `license_type`, and `license_source_url` outside manual source extraction; these fields use reviewed admin presets by source.
- [ ] **Optional source-context check**:
  - [ ] Let the admin request a lightweight `curl` check for a trusted public source URL.
  - [ ] Verify status, redirects, content type, and whether expected page data is present.
  - [ ] Classify the result as `static HTML`, `JavaScript-rendered`, unavailable, or requiring authentication.
  - [ ] Avoid private credentials and unsafe/private-network redirects.
- [ ] **Future browser automation fallback**:
  - [ ] Consider Playwright or Selenium only if copied HTML cannot provide the required data and manual extraction is insufficient.
  - [ ] Keep browser automation outside the public frontend and disabled by default for the low-memory workflow.
  - [ ] Capture source URL, retrieval timestamp, extracted fields, and failures for auditability.
- [ ] **Safe automatic preparation**:
  - [ ] Generate a slug from the title.
  - [ ] Apply known default values without overwriting deliberate admin input.
  - [ ] Suggest orientation from the image aspect ratio when dimensions are available.
  - [ ] Validate required fields and basic URL, text, and format constraints.
- [ ] **License presets by source**:
  - [ ] Provide a reviewed Leonardo AI preset for `license_notes`, `license_type`, and `license_source_url`, preserving the Portuguese policy text used in the catalog.
  - [ ] Provide a generic Civitai preset for the same trio without asserting commercial rights or approval automatically.
  - [ ] Let the admin select or edit the preset before saving, and keep license approval as a separate manual decision.
- [ ] **Assisted prefill**:
  - [ ] Add an action to apply a selected source preset and prepare a draft artwork without publishing automatically.
  - [ ] Let the title generate the slug and preserve deliberate admin input.
  - [ ] Keep every preset-applied value editable and visibly distinguish preset values from confirmed values.
- [ ] **Future local parser (deferred)**:
  - [ ] Parse pasted fragments locally with the browser `DOMParser`, only after manual field mapping proves repetitive.
  - [ ] Compare Leonardo AI and Civitai samples against `supabase/artworks_rows.json` before choosing selectors.
  - [ ] Extract only predictable fields and report missing, ambiguous, or unstable selectors instead of guessing silently.
- [ ] **Low-memory operation**:
  - [ ] Process one artwork at a time in the current browser tab.
  - [ ] Keep parser, Ollama, n8n, Apify, MCP, Playwright, and Selenium optional rather than required dependencies.
- [ ] **Mandatory human review**:
  - [ ] Require manual confirmation of the final image, license status, credits, price, SKU, stock, and publication.
  - [ ] Never publish or mark a license approved from an automated suggestion alone.
- [ ] **Product setup assistance**:
  - [ ] Offer a product and one initial named variant as a draft after artwork review.
  - [ ] Allow the admin to edit, add, or remove variants before saving.

### Phase 5: PWA & Optimization
- [ ] **PWA Implementation**:
  - [ ] Configure `vite-plugin-pwa`.
  - [ ] Create `manifest.json` and add app icons.
  - [ ] Implement service worker for offline caching of catalog.
- [ ] **Performance**:
  - [ ] Optimize image loading (lazy loading, client-side resize/compression, WebP).
  - [ ] Monitor Supabase Storage quota and per-file limits before catalog expansion.
  - [ ] Implement basic SEO meta tags.
- [ ] **Deployment**:
  - [ ] Connect GitHub repo to Vercel.
  - [ ] Configure environment variables in Vercel.
  - [ ] Setup `development`, `preview`, and `production` environments.

### Phase 6: Compliance & Documentation
- [ ] **Legal Dossier**:
  - [ ] Create a system/table for documenting the origin, prompt, and license of each artwork.
  - [ ] Add license attribution to product pages/back-of-frame metadata.
- [ ] **Documentation**:
  - [ ] Finalize project README.
  - [ ] Document Supabase schema, admin Auth/RLS, Storage, and Edge Function logic.

## 🧭 Next Session Handoff
- Current working admin route: `/admin/login` and `/admin`.
- Admin role is read from Supabase Auth `app_metadata.role`; do not use `user_metadata` for authorization.
- Migrations `0002_admin_cms.sql` and `0003_artwork_provenance.sql` have been applied in Supabase.
- The current upload field is [src/components/ImageUploadField.tsx](src/components/ImageUploadField.tsx); it uploads directly to the public `artworks` bucket and caps files at 12 MB.
- The remote importer is [supabase/functions/import-artwork-image/index.ts](supabase/functions/import-artwork-image/index.ts), but it is not yet invoked by the frontend.
- The admin now supports artworks, license review, products, and `30x45`/`45x30` variants.
- Next implementation order: test the public artwork route and cart, then connect upload/import to artwork records and add Storage cleanup.
- Next automation session: design the artwork prefill flow, starting with the `curl` source-page check; choose Playwright/Selenium only after confirming the source is static or JavaScript-rendered.
- Storage decision: no local/web toggle for now. Web upload is the normal path; local Node remains an optional batch/recovery tool.
- The Supabase 50 MB limit is not currently a blocker because the UI and Edge Function accept at most 12 MB per image. Before scaling the catalog, add client-side WebP resizing/compression and review total quota versus paid Storage.

### Phase 7 (New/Optional): Automated Payments
- [ ] Integrate Stripe/PayPal for those who want instant checkout.
