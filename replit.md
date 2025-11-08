# Photographer Portfolio & Invoicing Application

## Overview

This is a modern photographer portfolio and client management web application built with React and Express. The application serves dual purposes: presenting a beautiful photography portfolio to potential clients while providing administrative tools for creating and managing Stripe invoices. The frontend showcases photography work across multiple categories (weddings, portraits, landscapes, events, commercial) with a photography-first design philosophy that emphasizes visual storytelling through generous whitespace and elegant typography.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- **React 18** with functional components and hooks for UI state management
- **Vite** as the build tool and development server for fast hot module replacement
- **TypeScript** for type safety across the codebase
- **Wouter** for lightweight client-side routing (alternative to React Router)

**UI Component Strategy:**
- **shadcn/ui** as the primary component library, built on Radix UI primitives
- **TailwindCSS** for utility-first styling with custom design tokens
- Component architecture follows the "new-york" shadcn style variant
- Custom CSS variables for theming (light/dark mode support)

**Design System:**
- Typography hierarchy using Inter (body/UI), Playfair Display (headlines), and JetBrains Mono (technical data)
- Spacing system based on Tailwind's standard scale (4, 8, 12, 16, 24, 32)
- Photography-first layout with full-viewport hero sections and responsive grid galleries
- Dark theme with refined aesthetics inspired by premium photography platforms

**State Management:**
- **TanStack Query (React Query)** for server state management, caching, and data fetching
- Local component state via React hooks (useState, useEffect)
- Form state managed by **react-hook-form** with Zod schema validation

### Backend Architecture

**Server Framework:**
- **Express.js** running on Node.js with ESM module syntax
- Development server integrates Vite middleware for SSR-like development experience
- Production builds serve static assets from dist/public

**API Design:**
- RESTful endpoint pattern (`/api/*` prefix)
- Request/response logging middleware for debugging
- JSON body parsing with raw body capture for webhook verification
- CORS and session handling built-in

**Validation:**
- **Zod** schemas for runtime type validation on API inputs
- Shared schema definitions between client and server (in `shared/schema.ts`)

### Data Storage

**Database Strategy:**
- **Drizzle ORM** configured for PostgreSQL dialect
- Database connection via **@neondatabase/serverless** driver
- Schema definitions in `shared/schema.ts` with migrations in `migrations/` directory
- Note: Current implementation uses Stripe as the primary data store for invoices/customers (no local database persistence for business data yet)

### External Dependencies

**Stripe Payment Platform:**
- **Stripe API** integration for invoice creation and customer management
- Server-side SDK (`stripe` package) handles customer creation, invoice generation, and invoice item management
- Client-side integration via `@stripe/stripe-js` and `@stripe/react-stripe-js` (prepared for future payment flows)
- Environment variable required: `STRIPE_SECRET_KEY`

**Invoice Creation Flow:**
1. Backend validates invoice request (client name, email, service description, amount)
2. Searches for existing Stripe customer by email or creates new customer
3. Creates Stripe invoice with 30-day payment terms
4. Adds invoice line item for photography service
5. Finalizes and sends invoice to client email
6. Returns invoice URL and ID to frontend

**Third-Party UI Libraries:**
- **Radix UI** primitives for accessible, unstyled components
- **Lucide React** for icon system
- **date-fns** for date formatting and manipulation
- **cmdk** for command palette pattern
- **class-variance-authority** for variant-based component styling

**Development Tools:**
- Replit-specific plugins for runtime error overlays, dev banners, and cartographer
- **tsx** for TypeScript execution in development
- **esbuild** for production server bundling

### Application Structure

**Page Routes:**
- `/` - Hero landing page with photographer branding
- `/portfolio` - Filterable gallery with category tabs
- `/about` - Photographer biography and professional image
- `/contact` - Lead capture form for booking inquiries
- `/admin` - Invoice management dashboard (create invoices, view invoice table)

**Asset Management:**
- Static images stored in `attached_assets/generated_images/`
- Vite alias `@assets` for clean image imports
- Path aliases: `@/` (client src), `@shared/` (shared types/schemas)