# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vyadove (ShopNex)** is an open-source e-commerce platform built as a monorepo. It consists of a headless CMS powered by Payload CMS and a Next.js 15 storefront with Stripe payment integration. The platform emphasizes developer experience with TypeScript, a modular plugin architecture, and modern React patterns.

## Monorepo Structure

This is a pnpm workspace monorepo managed by Turbo:

- **apps/cms** - Payload CMS headless admin interface (port 3000)
- **apps/shop** - Next.js 15 customer-facing storefront (port 3020)
- **apps/test-shop** - Testing environment for storefront
- **packages/** - Shared packages:
  - `@vyadove/types` - Shared TypeScript types
  - `@vyadove/stripe-plugin` - Custom Stripe payment integration
  - `@shopnex/payload-sdk` - Type-safe SDK for Payload API communication
  - `@shopnex/*-plugin` - Various CMS plugins (analytics, import-export, email, etc.)

## Development Commands

### Root-Level Commands

```bash
pnpm dev                      # Start both CMS and Shop (Turbo)
pnpm dev:withtest            # Start CMS, Shop, and test-shop
pnpm dev:cms                 # Start only CMS (port 3000)
pnpm dev:shop                # Start only Shop (port 3020, Turbo)
pnpm dev:test-shop           # Start only test-shop

pnpm build                   # Build all apps (Turbo)
pnpm format                  # Format all files with Prettier

pnpm db:seed                 # Seed CMS database with sample data
pnpm test:e2e                # Run Playwright E2E tests
```

### CMS-Specific Commands (apps/cms)

```bash
pnpm --filter ./apps/cms dev                # Start CMS dev server
pnpm --filter ./apps/cms build              # Production build
pnpm --filter ./apps/cms db:seed            # Seed database

pnpm --filter ./apps/cms generate:types     # Generate TypeScript types from Payload schema
pnpm --filter ./apps/cms generate:schema    # Generate database schema
pnpm --filter ./apps/cms migrate:create     # Create new migration
pnpm --filter ./apps/cms migrate            # Run migrations

pnpm --filter ./apps/cms lint               # ESLint checking
```

### Shop-Specific Commands (apps/shop)

```bash
pnpm --filter apps/shop dev                 # Start shop dev server (Turbo, port 3020)
pnpm --filter apps/shop build               # Production build
pnpm --filter apps/shop start               # Start production server
pnpm --filter apps/shop lint                # ESLint with zero warnings
pnpm --filter apps/shop test                # Run Bun tests
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with server components by default
- **Language**: TypeScript 5.7+ (strict mode)
- **CMS**: Payload CMS 3.49.1
- **Database**: PostgreSQL (primary), SQLite (dev/testing)
- **Package Manager**: pnpm 10.7.1
- **Build Tool**: Turbo (monorepo)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Context, Zustand, TanStack Query v5
- **Payments**: Stripe (custom plugin + commerce-kit)
- **Storage**: Vercel Blob Storage
- **Testing**: Playwright (E2E), Vitest (unit)

### CMS ↔ Shop Communication

The Shop app communicates with the CMS via the **Payload SDK** (`@shopnex/payload-sdk`):

1. **Shop app** initializes SDK in `apps/shop/src/utils/payload-sdk.ts`:
   ```typescript
   const payloadSdk = new PayloadSDK({
     baseURL: `${NEXT_PUBLIC_SERVER_URL}/api`,
     credentials: "include"
   });
   ```

2. **All data fetching** uses this SDK with type-safe methods:
   - `payloadSdk.find()` - Query collections with filters
   - `payloadSdk.findByID()` - Get single document
   - `payloadSdk.create()` - Create documents (carts, orders)
   - `payloadSdk.update()` - Update documents
   - `payloadSdk.login()` / `payloadSdk.me()` - Authentication

3. **TypeScript types** are shared via `@vyadove/types` package and auto-generated from Payload collections

4. **Environment variable**: Shop uses `NEXT_PUBLIC_SERVER_URL` to point to CMS API (defaults to http://localhost:3000)

### Payload CMS Collections (25+)

Core collections defined in `apps/cms/src/payload.config.ts`:

**Commerce Collections:**
- `products` - Product catalog with variants, pricing tiers, inventory
- `orders` - Order management with timeline tracking
- `carts` - Shopping cart with session/user association
- `payments` - Payment records (Stripe integration)
- `checkout-sessions` - Checkout flow state
- `collections` - Product collections/groupings
- `category` - Hierarchical product categories
- `gift-cards` - Digital gift card system
- `shipping` - Shipping providers and methods
- `locations` - Warehouse/inventory locations

**Content Collections:**
- `hero-page`, `footer-page`, `privacy-policy-page`, `terms-and-conditions-page`, `support`, `forms`

**System Collections:**
- `users` - Authentication and user management
- `media` - File/image storage (Vercel Blob)
- `campaigns` - Email campaigns with tracking
- `plugins` - Plugin management
- `policies` - Store policies
- `themes` - Storefront theming

**Globals:**
- `store-settings` - Global store configuration (currency, policies)
- `main-menu` - Navigation configuration

### Plugin System

CMS uses a modular plugin architecture (`apps/cms/src/plugins.ts`):

- **stripePlugin** - Payment processing with webhooks (`payment_intent.succeeded`, `payment_intent.canceled`)
- **formBuilderPlugin** - Dynamic form builder
- **importExportPlugin** - Bulk CSV/JSON import/export for products, orders, collections
- **seoPlugin** - SEO metadata management
- **searchPlugin** - Full-text search indexing (products searchable by title, description, category)
- **vercelBlobStorage** - Media file storage
- **analyticsPlugin** - Sales tracking and analytics
- **easyEmailPlugin** - Email template system
- **quickActionsPlugin** - CMS UI enhancements
- **sidebarPlugin** - Custom sidebar configuration

### Key Architectural Patterns

**CMS (apps/cms):**
- Payload collections with custom hooks (beforeChange, afterChange)
- Access control via role-based permissions (`admins`, custom access functions)
- Webhooks for Stripe events → create/update payments and orders
- Cart system with session-based (cookie) and user-based persistence
- Order timeline tracking with status updates (pending → processing → shipped → delivered)

**Shop (apps/shop):**
- Server components by default for performance
- Server actions for mutations (`apps/shop/src/actions/`)
- Route groups: `(store)` for main store layout
- Dynamic routes: `[slug]` for products, `[id]` for orders
- Cart management via React Context (`apps/shop/src/providers/cart/`)
- TanStack Query for data fetching with caching
- Search implemented via server actions (`apps/shop/src/actions/search-actions.ts`)

## Environment Configuration

### CMS (.env in apps/cms)

```bash
# Database
DATABASE_URI=file:./payload.db                    # SQLite (dev)
VYADOVE_POSTGRES_URL=postgresql://...             # PostgreSQL (production)

# Payload
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com                     # Auto-login in dev
ADMIN_PASSWORD=password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOKS_SIGNING_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_IS_TEST_KEY=true

# Storage
VYA_READ_WRITE_TOKEN=vercel_blob_token            # Vercel Blob Storage
```

### Shop (.env in apps/shop)

```bash
# CMS Connection
NEXT_PUBLIC_SERVER_URL=http://localhost:3000      # CMS API URL

# Stripe (must match CMS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CURRENCY=usd
ENABLE_STRIPE_TAX=false                           # Optional: Stripe Tax

# Optional
NEXT_PUBLIC_LANGUAGE=en-US
NEXT_PUBLIC_SHOP_URL=http://localhost:3020
```

## Code Style & Standards

- **Indentation**: Tabs (CMS), varies by app
- **TypeScript**: Strict mode, no unused locals, import type enforcement
- **Formatting**: Prettier with `@trivago/prettier-plugin-sort-imports`
- **Linting**: ESLint 9 with Next.js config
- **Git Hooks**: Husky 9 for pre-commit checks
- **No emojis** unless explicitly requested

## Key Development Patterns

### Working with Payload Collections

When modifying CMS collections (`apps/cms/src/collections/`):

1. **Always run `generate:types`** after schema changes to update TypeScript types
2. **Create migrations** for production schema changes: `pnpm --filter ./apps/cms migrate:create`
3. **Use hooks** for side effects (e.g., `revalidate-shop.ts` to bust Next.js cache after product updates)
4. **Access control** is defined per collection - check `access` object before modifying permissions

### Cart & Checkout Flow

1. **Cart creation**: Session-based (cookie `cart-session`) or user-based (authenticated)
2. **Cart → Checkout**: Creates `checkout-sessions` document with cart snapshot
3. **Checkout → Payment**: Stripe integration via `@vyadove/stripe-plugin`
4. **Payment webhook** → Creates/updates `orders` and `payments` collections
5. **Order timeline**: Automatically tracked with events (created, paid, shipped, delivered)

### Search Implementation

- **CMS**: Payload Search Plugin indexes products (title + description + category titles)
- **Shop**: Uses `searchPlugin` beforeSync hook to create searchable text
- **Query**: Server action in `apps/shop/src/actions/search-actions.ts` calls Payload search API

### Type Generation Workflow

```bash
# 1. Modify Payload collection schema in apps/cms/src/collections/
# 2. Generate types (runs automatically in CMS)
pnpm --filter ./apps/cms generate:types

# 3. Types are generated to apps/cms/src/payload-types.ts
# 4. Shared types in packages/types/ are manually maintained
# 5. Shop app imports types from @vyadove/types workspace package
```

### Adding New Plugins

1. Create plugin in `packages/your-plugin-name/`
2. Add to `apps/cms/src/plugins.ts` imports and array
3. Configure plugin options (access control, collection slugs, etc.)
4. Rebuild CMS: `pnpm --filter ./apps/cms build`

## Testing

- **E2E Tests**: Playwright config in root `playwright.config.ts`
- **Run E2E**: `pnpm test:e2e` (runs against both apps)
- **Unit Tests**: Vitest in Shop app
- **Test Data**: Use `pnpm db:seed` to populate CMS with sample data

## Common Gotchas

- **Port conflicts**: CMS runs on 3000, Shop on 3020 - ensure both are available
- **Environment variables**: Must be duplicated between CMS and Shop (especially Stripe keys)
- **TypeScript types**: Shop app may be stale after CMS schema changes - restart dev server
- **Database migrations**: Required for production PostgreSQL, but SQLite auto-migrates in dev
- **CORS**: CMS and Shop communicate via fetch - ensure `credentials: "include"` is set
- **Turbo caching**: If builds seem stale, clear cache with `turbo clean`
- **Windows paths**: Use forward slashes in imports, backslashes in tool outputs are system-generated

## Deployment Notes

- **Vercel-ready**: Both apps configured for Vercel deployment
- **Docker support**: Dockerfile included for containerized deployment
- **Standalone mode**: Next.js configured for standalone output
- **Database**: Migrate from SQLite to PostgreSQL for production
- **Environment vars**: Set all required env vars in hosting platform
- **Stripe webhooks**: Configure webhook endpoint in Stripe Dashboard → CMS `/api/stripe/webhooks`

## Additional Resources

- **Payload CMS Docs**: https://payloadcms.com/docs
- **Next.js 15 Docs**: https://nextjs.org/docs
- **Stripe Integration**: Custom plugin in `packages/stripe-plugin/`
- **Discord Community**: https://discord.gg/MFc9x7vdXK
- use the project's design system components (Button, Badge, TypographySmall, etc) instead of hardcoded HTML elements with custom styling. This ensures better consistency.
- avoid using `any` type in TypeScript whenever possible.
