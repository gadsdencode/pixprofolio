# Design Guidelines: Photographer Portfolio & Invoicing Application

## Design Approach

**Reference-Based: Photography Portfolio Excellence**

Drawing inspiration from premium photography platforms (Unsplash, Format, Behance) combined with modern SaaS admin interfaces (Linear, Stripe Dashboard). The design prioritizes visual storytelling through imagery while maintaining professional functionality for client management.

**Core Principles:**
- Photography-first: Let images breathe with generous whitespace
- Professional elegance: Dark theme with refined typography
- Seamless dual-purpose: Portfolio beauty meets admin efficiency

## Typography

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - All body text, UI elements, forms
- Display: 'Playfair Display' - Hero headlines, page titles, photographer name
- Monospace: 'JetBrains Mono' - Invoice IDs, technical data

**Hierarchy:**
- Hero Headlines: text-6xl md:text-7xl lg:text-8xl, font-light (Playfair Display)
- Page Titles: text-4xl md:text-5xl, font-medium
- Section Headers: text-2xl md:text-3xl, font-semibold
- Body Text: text-base md:text-lg, leading-relaxed
- Captions/Meta: text-sm, text-muted-foreground

## Layout System

**Spacing Primitives (Tailwind):**
Primary units: **4, 8, 12, 16, 24, 32**
- Component padding: p-4, p-8
- Section spacing: py-16 md:py-24 lg:py-32
- Grid gaps: gap-4, gap-8
- Margins: mb-8, mb-12, mb-16

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl mx-auto px-4 md:px-8
- Content sections: max-w-6xl mx-auto
- Text content: max-w-3xl for optimal reading
- Admin dashboard: max-w-7xl for data tables

## Page-Specific Treatments

### Home Page
**Hero Section:**
- Full viewport height (min-h-screen) with stunning photography background
- Dark gradient overlay (from-black/70 to-black/40) for text readability
- Centered content with headline + tagline + dual CTAs
- Buttons with backdrop-blur-md bg-white/10 border border-white/20
- Scroll indicator at bottom (animated chevron)

### Portfolio Gallery
**Layout:**
- Masonry-style grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Category tabs at top (shadcn Tabs) with All/Weddings/Portraits/Landscape
- Cards with hover lift effect (hover:scale-105 transition-transform duration-300)
- Each card: aspect-square or aspect-video images with overlay on hover showing title/category

**Card Design:**
- Minimal borders, focus on imagery
- Overlay appears on hover with gradient backdrop
- Typography: text-xl font-medium for titles, text-sm text-muted-foreground for categories

### About Page
**Layout:**
- Two-column desktop (grid grid-cols-1 lg:grid-cols-2 gap-12)
- Left: Large portrait image (rounded-2xl, subtle shadow)
- Right: Headline + multi-paragraph bio with generous line-height (leading-relaxed)
- Background: Subtle gradient or solid dark surface

### Contact/Booking Form
**Design:**
- Centered card (max-w-2xl) with generous padding (p-8 md:p-12)
- Form fields with shadcn/ui styling
- Grouped fields: Personal info → Project details → Message
- Prominent submit button (w-full, primary variant)
- Success dialog with checkmark icon and thank you message

### Admin Dashboard
**Layout:**
- Split view: Left sidebar (fixed) with navigation, right content area
- Create Invoice card at top (bg-card border rounded-lg p-8)
- Recent Invoices table below with full-width responsive table
- Table: Striped rows, hover states, status badges (paid/sent/draft with color coding)

**Form Design:**
- Grid layout for invoice form (grid-cols-1 md:grid-cols-2 gap-4)
- Clear labels with text-sm font-medium
- Submit button: "Generate Stripe Invoice" with loading state

## Component Library

**Navigation:**
- Sticky header with backdrop-blur-lg bg-background/80
- Logo/brand left (Playfair Display, text-2xl)
- Nav links right with hover underline effect
- Mobile: Hamburger menu (shadcn Sheet component)

**Footer:**
- Simple centered layout with copyright and social icons
- Links in muted text with hover states
- py-8 md:py-12 spacing

**Buttons:**
- Primary: Default shadcn button styling
- Hero CTAs: Ghost variant with backdrop-blur and borders
- Never add custom hover states - use shadcn defaults

**Cards:**
- Portfolio: Minimal, image-focused with subtle borders
- Admin: Standard shadcn card with header/content/footer sections
- Consistent rounded-lg corners

**Forms:**
- Full shadcn Form component implementation
- Labels above inputs
- Error states with red text below fields
- Adequate spacing between fields (space-y-4)

**Tables:**
- shadcn Table with proper header styling
- Alternating row colors for readability
- Status badges with appropriate variant colors

## Images

**Image Usage:**
1. **Home Hero:** Full-screen landscape photography (1920x1080), dramatic lighting, professionally composed shot
2. **Portfolio Items:** High-quality placeholder images (600x400), varied compositions representing different photography styles
3. **About Page:** Professional portrait of photographer (400x400 or larger), well-lit headshot or environmental portrait
4. **All images:** Use object-cover for proper cropping, loading="lazy" for performance

**Image Treatment:**
- No filters or excessive processing - let photography speak
- Subtle rounded corners on non-hero images (rounded-lg or rounded-2xl)
- Proper aspect ratios maintained across responsive breakpoints

## Animations

**Minimal, Purposeful Motion:**
- Card hover: Subtle scale transform (scale-105, duration-300)
- Page transitions: None (instant navigation)
- Form submissions: Loading spinner only
- Scroll indicator: Gentle bounce animation on hero
- No parallax, no scroll-triggered animations, no excessive motion