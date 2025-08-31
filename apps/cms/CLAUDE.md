# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the CMS application for ShopNex, a Next.js-based e-commerce content management system built on Payload CMS 3. The CMS serves as the admin interface for managing products, orders, users, campaigns, and various e-commerce features.

## Essential Commands

- **Development**: `npm run dev` - Start the development server with hot reload
- **Build**: `npm run build` - Build for production
- **Lint**: `npm run lint` - Run ESLint, use `npm run lint:quiet` for minimal output
- **Format**: `npm run format` - Format code with Prettier
- **Type Generation**: `npm run generate:types` - Generate TypeScript types from Payload schemas
- **Database**: `npm run db:seed` - Seed the database with initial data
- **Schema**: `npm run generate:schema` - Generate database schema
- **Import Map**: `npm run generate:importmap` - Generate import map for admin UI

## Architecture

### Core Framework
- **Payload CMS 3** as the headless CMS with Next.js 15 and React 19
- **SQLite** database with libsql adapter
- **Lexical Editor** for rich text content

### Key Directories
- `src/collections/` - Payload collection definitions (Products, Orders, Users, etc.)
- `src/globals/` - Global settings and configurations
- `src/plugins.ts` - Plugin configurations for extended functionality
- `src/utils/` - Utility functions and helpers
- `src/fields/` - Reusable field definitions
- `src/access/` - Access control and permissions

### Collections Architecture
The CMS manages these core collections:
- **Products** - Product catalog with variants, inventory, pricing
- **Orders** - Order management with status tracking
- **Users** - User accounts and authentication
- **Collections** - Product categories and groupings
- **Media** - File and image management
- **Campaigns** - Marketing campaigns
- **Coupons** - Discount codes and promotions
- **Policies** - Store policies (shipping, returns, etc.)
- **TaxRules** - Tax calculation rules

### Plugin System
The application uses multiple ShopNex plugins:
- `@shopnex/stripe-plugin` - Payment processing
- `@shopnex/cj-plugin` - CJ affiliate integration
- `@shopnex/analytics-plugin` - Analytics tracking
- `@shopnex/import-export-plugin` - Data import/export
- `@shopnex/builder-io-plugin` - Visual page building
- `@shopnex/easy-email-plugin` - Email template management
- `@shopnex/quick-actions-plugin` - Admin UI shortcuts

### Configuration
- **Environment**: Uses SQLite database (dev.db) with configurable DATABASE_URI
- **CORS**: Configured for storefront and email service integration
- **Multi-tenant**: Supports multiple shop URLs via NEXT_PUBLIC_STOREFRONT_URL
- **Type Generation**: Outputs to shared packages/types/index.ts for cross-package type safety

## Development Notes

- Node.js 18.20.2+ or 20.9.0+ required with pnpm 9+
- The admin interface runs on the root path ("/")
- Development database is SQLite-based for simplicity
- Sharp is used for image optimization (pinned to 0.32.6)
- Custom sync plugin functionality available via `syncPlugin`
- Health check endpoint available at `/healthz`