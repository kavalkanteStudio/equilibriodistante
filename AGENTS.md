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

### Phase 4.1: UI/UX Polishing & Branding
- [ ] **Global Layout**:
  - [ ] Create `Header` component (Top Bar) with Logo, Navigation, and Cart Count.
  - [ ] Create `Footer` component with professional links and copyright.
  - [ ] Implement a `Layout` wrapper for all pages.
- [ ] **Landing Page Experience**:
  - [ ] Build a high-impact `Hero` section for the Home page.
  - [ ] Refine Home page layout for luxury feel.
- [ ] **Supporting Pages**:
  - [ ] Create a minimal `About` page.
  - [ ] Create a minimal `Contact` page.

### Phase 5: PWA & Optimization
- [ ] **PWA Implementation**:
  - [ ] Configure `vite-plugin-pwa`.
  - [ ] Create `manifest.json` and add app icons.
  - [ ] Implement service worker for offline caching of catalog.
- [ ] **Performance**:
  - [ ] Optimize image loading (lazy loading, WebP).
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
  - [ ] Document Supabase schema and Edge Function logic.

### Phase 7 (New/Optional): Automated Payments
- [ ] Integrate Stripe/PayPal for those who want instant checkout.
