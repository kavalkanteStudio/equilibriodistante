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

### Phase 1: Foundation & Setup
- [ ] **Project Initialization**:
  - [ ] Verify Vite + React + TS installation.
  - [ ] Configure ESLint and Prettier.
  - [ ] Setup `.gitignore` and `.env.example` (ensuring no secrets are committed).
- [ ] **UI Base**:
  - [ ] Install and configure Tailwind CSS.
  - [ ] Initialize shadcn/ui.
  - [ ] Setup global CSS and Tailwind theme (colors, spacing).
- [ ] **Typography Integration**:
  - [ ] Import and configure `Bricolage Grotesque`, `Oswald`, and `Six Caps`.
  - [ ] Define typography scales in Tailwind config.

### Phase 2: Database Modeling & Security (Supabase)
- [ ] **Schema Design**:
  - [ ] Create `collections` table (id, slug, name, description, cover_image, status, published_at).
  - [ ] Create `artworks` table (id, collection_id, title, slug, prompt_summary, workflow_description, civitai_url, leonardo_url, license_notes, source_model, final_image_url, published).
  - [ ] Create `products` table (id, artwork_id, product_type, title, description, base_price, active).
  - [ ] Create `product_variants` table (id, product_id, size, color, sku, stock_quantity, price).
  - [ ] Create `orders` table (id, customer_id, status, total_amount, payment_reference, shipping_reference).
  - [ ] Create `order_items` table (id, order_id, product_variant_id, quantity, unit_price).
- [ ] **Security & RLS**:
  - [ ] Enable Row Level Security (RLS) on all tables.
  - [ ] Create "Public Read" policy for `collections`, `artworks`, and `products` (where `active = true` or `published = true`).
  - [ ] Create "User Own" policy for `orders` (where `customer_id = auth.uid()`).
- [ ] **Storage**:
  - [ ] Configure Supabase Storage buckets for artwork images and product previews.
  - [ ] Setup public access policies for these buckets.

### Phase 3: Core Feature - Public Catalog
- [ ] **Catalog Routing**:
  - [ ] Implement React Router for main pages: Home, Collections, Artwork Detail, Product Detail.
- [ ] **Collection Gallery**:
  - [ ] Build a page to list all active collections.
  - [ ] Implement a a "Collection Detail" page showing all artworks in a collection.
- [ ] **Artwork/Product Display**:
  - [ ] Build a high-quality image gallery for artworks.
  - [ ] Implement product selection (variants: size, color).
  - [ ] Create a "Product Detail" view with pricing and description.
- [ ] **State Management**:
  - [ ] Integrate TanStack Query for efficient data fetching from Supabase.

### Phase 4: Order Management & Integration
- [ ] **Shopping Cart**:
  - [ ] Implement a local state-based shopping cart (LocalStorage/Context).
  - [ ] Build cart UI with shadcn/ui components.
- [ ] **Checkout Flow**:
  - [ ] Create a checkout form with validation (Zod + React Hook Form).
  - [ ] Implement an Edge Function to handle payment session creation (e.g., Stripe/PayPal).
  - [ ] Implement a webhook handler for payment confirmation to update `orders` table.
- [ ] **Admin/Backoffice**:
  - [ ] Setup Supabase Auth for administrator access.
  - [ ] Create a basic admin dashboard to manage products and orders.

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
