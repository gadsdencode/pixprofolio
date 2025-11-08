# Photographer Portfolio & Invoicing Application

## Overview

This is a modern photographer portfolio and client management web application built with React and Express. The application serves dual purposes: presenting a beautiful photography portfolio to potential clients while providing administrative tools for creating and managing Stripe invoices. The frontend showcases photography work across multiple categories (weddings, portraits, landscapes, events, commercial) with a photography-first design philosophy that emphasizes visual storytelling through generous whitespace and elegant typography.

## Recent Changes (November 8, 2025)

### Initial Portfolio Website Build
- Built complete photographer portfolio website with 5 main pages (Home, Portfolio, About, Contact, Admin)
- Integrated real Stripe API for invoice creation and management
- Created PostgreSQL database with 4 tables: clients, invoices, portfolio_items, contact_inquiries
- Implemented full database persistence for all invoice and contact form data
- Created beautiful dark-themed UI with Inter, Playfair Display, and JetBrains Mono fonts
- Generated custom photography images for portfolio and hero sections
- Implemented responsive navigation with mobile menu support
- Added complete invoice workflow: customer creation, invoice generation, finalization, and email delivery
- Added "Realtor/Home Photography" as a new portfolio category
- Tested end-to-end invoice creation flow with Stripe test mode

### Authentication System Refactor (Completed)
- **Google OAuth Integration**: Added Google OAuth 2.0 authentication alongside existing email/password login
- **Auth Context**: Created centralized AuthContext for global authentication state management
- **Protected Routes**: Implemented ProtectedRoute component with role-based access control
- **Security Enhancement**: New OAuth users receive 'client' role by default (not admin) for security
- **User Profile Display**: Added user profile section in admin dashboard showing name, email, provider, and logout
- **Session Management**: Passport.js with PostgreSQL session storage for persistent authentication
- **Error Handling**: Comprehensive error handling for failed logins, OAuth failures, and session issues
- **Database Updates**: Extended users table with OAuth fields (provider, providerId, profilePicture)

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
- Custom CSS variables for theming (dark mode as default)

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
- JSON body parsing for API requests
- Stripe webhook support ready for future implementation

**Validation:**
- **Zod** schemas for runtime type validation on API inputs
- Shared schema definitions between client and server (in `shared/schema.ts`)

### Data Storage

**Database Strategy:**
- No database persistence currently implemented
- Stripe acts as the source of truth for customer and invoice data
- In-memory storage removed as it's not needed for current functionality

### External Dependencies

**Stripe Payment Platform:**
- **Stripe API** integration for invoice creation and customer management
- Server-side SDK (`stripe` package) handles customer creation, invoice generation, and invoice item management
- Environment variables required: `STRIPE_SECRET_KEY` (production), `TESTING_STRIPE_SECRET_KEY` (testing)
- Client-side integration via `@stripe/stripe-js` and `@stripe/react-stripe-js` (prepared for future payment flows)
- Environment variables: `VITE_STRIPE_PUBLIC_KEY` (production), `TESTING_VITE_STRIPE_PUBLIC_KEY` (testing)

**Invoice Creation Flow:**
1. Backend validates invoice request (client name, email, service description, amount)
2. Searches for existing Stripe customer by email or creates new customer
3. Creates Stripe invoice with 30-day payment terms
4. Adds invoice line item for photography service with specified amount
5. Finalizes invoice (makes it immutable and ready for payment)
6. Sends invoice to client email via Stripe
7. Returns hosted invoice URL to frontend for display

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
- `/` - Hero landing page with photographer branding and dramatic hero image
- `/portfolio` - Filterable gallery with category tabs (All, Weddings, Portraits, Landscape, Events, Commercial)
- `/about` - Photographer biography with professional portrait and detailed bio text
- `/contact` - Lead capture form for booking inquiries with project type selection
- `/admin` - Invoice management dashboard (create invoices, view invoice table)

**Key Features:**
- Responsive navigation with mobile menu
- Category filtering in portfolio using shadcn Tabs
- Contact form with validation (full name, email, project type, date, message)
- Real Stripe invoice generation with hosted invoice URLs
- Success dialog showing invoice details after creation
- Mock invoice history table in admin dashboard

**Asset Management:**
- Generated images stored in `attached_assets/generated_images/`
- Vite alias `@assets` for clean image imports
- Path aliases: `@/` (client src), `@shared/` (shared types/schemas)

### API Endpoints

**POST /api/create-invoice**
- Creates a Stripe invoice and sends it to the client
- Request body: `{ clientName: string, clientEmail: string, serviceDescription: string, amount: number }`
- Response: `{ success: boolean, invoiceUrl?: string, invoiceId?: string, error?: string }`
- Process:
  1. Validates request using Zod schema
  2. Creates or retrieves Stripe customer by email
  3. Creates invoice with 30-day due date
  4. Adds invoice item with amount and description
  5. Finalizes and sends invoice
  6. Returns hosted invoice URL

## Environment Variables

**Required Secrets:**
- `STRIPE_SECRET_KEY` - Production Stripe secret key (starts with `sk_live_`)
- `VITE_STRIPE_PUBLIC_KEY` - Production Stripe publishable key (starts with `pk_live_`)
- `TESTING_STRIPE_SECRET_KEY` - Test mode Stripe secret key (starts with `sk_test_`)
- `TESTING_VITE_STRIPE_PUBLIC_KEY` - Test mode Stripe publishable key (starts with `pk_test_`)

**How to Get Stripe Keys:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your Publishable key (safe to be public) → `VITE_STRIPE_PUBLIC_KEY`
3. Copy your Secret key (keep private) → `STRIPE_SECRET_KEY`
4. For testing, use test mode keys with the `TESTING_` prefix

## Development

**Running the Application:**
- Workflow: "Start application" runs `npm run dev`
- Starts Express server on port 5000
- Vite dev server with hot module replacement
- Both frontend and backend served on the same port

**Project Structure:**
```
client/
  src/
    components/
      Layout.tsx - Navigation header and footer
      ui/ - shadcn components
    pages/
      Home.tsx - Hero landing page
      Portfolio.tsx - Gallery with filtering
      About.tsx - Photographer bio
      Contact.tsx - Booking form
      Admin.tsx - Invoice dashboard
    App.tsx - Main router
    index.css - Tailwind + custom styles
server/
  routes.ts - API endpoints including Stripe integration
  index.ts - Express server setup
shared/
  schema.ts - Shared TypeScript types and Zod schemas
attached_assets/
  generated_images/ - AI-generated photography images
```

## Testing

End-to-end tests have been successfully run for:
- Admin invoice creation flow
- Form validation and submission
- Stripe API integration
- Success dialog and form reset

## Next Steps for Enhancement

1. **Authentication**: Add login system to protect the admin dashboard
2. **Invoice Management**: Fetch and display real invoices from Stripe instead of mock data
3. **Webhook Integration**: Handle Stripe webhooks for invoice status updates
4. **Client Portal**: Allow clients to view their invoices and payment history
5. **Image Upload**: Add ability to upload real portfolio images
6. **Email Notifications**: Send confirmation emails for contact form submissions
7. **Analytics**: Track portfolio views and contact form conversions
8. **SEO Optimization**: Add meta tags and structured data for better search visibility
