**Add your own guidelines here**

<!--

System Guidelines — Based on Creativity (BOC)

# General Guidelines

* Use responsive, well-structured layouts with flexbox and grid by default. Only use absolute positioning when necessary.
* All designs should feel luxury, creative, and premium — reflecting the "Modern Heritage" style: friendly curves of classic animation blended with clean, contemporary layouts.
* Maintain generous whitespace. Let content breathe. Dense layouts are off-brand.
* All interactive elements must have clear hover and focus states using brand colors.
* Trailing star effects are reserved for the navigation bar only. Do not apply them elsewhere.
* The footer should be clean and grounded — no particle effects. Use a subtle gold divider, logo, tagline, and gentle hover animations on links.
* Designs must meet WCAG 2.1 AA accessibility standards at minimum.
* Keep file sizes small. Put helper functions and components in their own files.
* Refactor and keep code/designs clean as you go.

--------------

# Design System Guidelines

## Brand Identity

* Company: Based on Creativity (BOC) — parent company
* Subsidiaries: Creativity Base Studios (animation), Creativity Base Press (publishing), Creativity Base Network (web platform)
* Other services (graphic design, web development, merchandise) operate directly under Based on Creativity
* Style: "Modern Heritage" — blends classic animation warmth with modern, clean design
* Tagline: "Built in the quiet. Born in the light."
* Philosophy: Sun (Gold = expression, creativity) and Moon (Indigo = reflection, depth) in balance

--------------

## Colors

### Primary Colors
* Indigo Blue: #1A1F4B — represents the moon, reflection, depth. Use for primary backgrounds, headers, and grounding elements.
* Gold: #FFC857 — represents the sun, creativity, expression. Use for accents, CTAs, highlights, and interactive elements. Only use on dark backgrounds for contrast.

### Secondary Colors
* Navy 700: #2D3566 — card headers
* Navy 950: #0F1530 — footer and deep sections
* Gold 700: #C9972E — links and hover states
* Cream: #FFF6D8 — card body background (light variant)
* Cream Accent: #F6E6B4 — accent background (light variant)
* Mid Blue: #233592 — card body background (blue variant)
* Blue Accent: #3761BE — accent background (blue variant)
* Gray Header: #BABBC1 — card header background (gray variant)
* Light Gray: #D8D7DB — card body background (gray variant)
* Lightest Gray: #EFEFF0 — accent background (gray variant)
* Dark Header: #0F1115 — card header background (dark variant)
* Charcoal: #2D2D2D — card body background (dark variant)
* Dark Accent: #414255 — accent background (dark variant)

### Text Colors
* Primary Text: #111111 — paragraphs and body copy
* Secondary Text: #3A3A3A — supporting and secondary text
* Inverse Text: #FFFFFF — text on dark backgrounds
* Muted Text: #D1D5DB — captions on dark backgrounds
* Light Secondary: #E5E7EB — occasional secondary text on dark

### Color Rules
* Gold (#FFC857) must only appear on dark backgrounds for proper contrast
* Never use Gold on white or light backgrounds
* All color combinations must meet WCAG 2.1 AA contrast requirements
* Color must never be the sole indicator of meaning or state

--------------

## Typography

### Font System
* Headings: Space Mono (monospace) — bold, structured, tech-forward
* Body: Source Sans 3 (sans-serif) — clean, readable, professional
* Accent: Cormorant Garamond (serif) — elegant, storytelling quality. Only use at 18px or larger. Reserved for quotes, taglines, and decorative text.

### Type Scale
* H1: 48px / Space Mono / Bold
* H2: 36px / Space Mono / Bold
* H3: 28px / Space Mono / Bold
* H4: 22px / Space Mono / Bold
* Body: 16–18px / Source Sans 3 / Regular / Line-height: 1.5–1.65
* Caption: 14px / Source Sans 3 / Regular
* Serif Accent: 18px minimum / Cormorant Garamond / Italic or Regular

### Typography Rules
* Never use Cormorant Garamond below 18px — it loses legibility
* Never mix more than 2 fonts on a single component
* Headings should always be Space Mono
* Body text should always be Source Sans 3
* Use a base font-size of 16px
* Line height for body text: 1.5 to 1.65
* Paragraph max-width: 65–75 characters for readability

--------------

## Logo

### Usage Rules
* Maintain minimum clear space of ¼ of the logo's height on all sides
* Never stretch, rotate, skew, or distort the logo
* Never place the logo on busy or cluttered backgrounds
* Never change the logo colors outside of approved variants
* Never add effects (drop shadows, glows, outlines) to the logo
* Never rearrange or separate logo elements
* Never pair the logo with unapproved typography

### Logo Variants
* Primary Emblem (golden circle): Use as the main logo in hero sections and headers
* Character Emblem (cream on black): Use as watermarks on animations and designer seal on merchandise
* Monogram (blocky BOC text): Use for app icons, favicons, and formal business assets

--------------

## Buttons

### Primary Button
* Purpose: Main action on a page or section
* Background: Gold (#FFC857)
* Text: Indigo Blue (#1A1F4B) / Space Mono / Bold
* Border-radius: 8px
* Padding: 12px 24px
* Hover: Gold 700 (#C9972E) background
* One primary button per section maximum

### Secondary Button
* Purpose: Supporting or alternative actions
* Background: Transparent
* Border: 2px solid Gold (#FFC857)
* Text: Gold (#FFC857) / Space Mono / Bold
* Border-radius: 8px
* Padding: 12px 24px
* Hover: Gold (#FFC857) background with Indigo (#1A1F4B) text

### Tertiary Button
* Purpose: Least important actions
* Background: None
* Border: None
* Text: Gold (#FFC857) / Source Sans 3 / Semibold
* Hover: Underline animation in Gold
* Use for inline actions or navigation links

--------------

## Cards

### Card Variants (from WCAG Typography System)

#### Cream/Gold Card
* Header: Navy 700 (#2D3566)
* Body: Cream (#FFF6D8)
* Accent: Cream Accent (#F6E6B4)
* Text: Primary (#111111)

#### Blue Card
* Header: Navy 700 (#2D3566)
* Body: Mid Blue (#233592)
* Accent: Blue Accent (#3761BE)
* Text: Inverse (#FFFFFF)

#### Gray Card
* Header: Gray Header (#BABBC1)
* Body: Light Gray (#D8D7DB)
* Accent: Lightest Gray (#EFEFF0)
* Text: Primary (#111111)

#### Dark Card
* Header: Dark Header (#0F1115)
* Body: Charcoal (#2D2D2D)
* Accent: Dark Accent (#414255)
* Text: Inverse (#FFFFFF)

### Card Rules
* Border-radius: 12px
* Padding: 24px
* Always use consistent card variant within a section — don't mix card types in the same row
* Card headings: Space Mono
* Card body text: Source Sans 3

--------------

## Icons

* Style: Rounded outline by default, filled for active/selected states, duotone for premium contexts
* Stroke weight: 1.5px (16px icons), 2px (24–32px icons), 2.5px (48px+ icons)
* Corner radius: Match logo's rounded aesthetic
* Colors: Gold on dark backgrounds, Indigo on light backgrounds, Inverse white on colored backgrounds
* Padding: Minimum 2px within bounding box
* Always use consistent stroke weight within a set
* Hover animation: Subtle scale (1.05x) with 200ms ease transition

--------------

## Spacing & Layout

* Base spacing unit: 8px
* Use multiples of 8 for all spacing (8, 16, 24, 32, 48, 64, 96)
* Section padding: 64px–96px vertical
* Container max-width: 1200px
* Grid: 12-column grid with 24px gutters
* Mobile breakpoint: 768px
* Tablet breakpoint: 1024px
* Always use CSS Grid or Flexbox — avoid absolute positioning

--------------

## Navigation

* Nav bar: Indigo Blue (#1A1F4B) background with Gold (#FFC857) text
* Trailing star particle effect on hover — nav bar ONLY
* Active page indicator: Gold underline
* Mobile: Hamburger menu with slide-in panel
* Max 7 items in primary navigation
* Dropdowns for sub-pages

## Footer

* Background: Navy 950 (#0F1530)
* Gold divider line at top
* Logo: Character Emblem (small)
* Tagline: "Built in the quiet. Born in the light." in Cormorant Garamond
* Link hover: Gold color shift with subtle underline animation
* Social icons: Scale up 1.05x on hover
* No particle effects in footer — keep it clean and grounded

--------------

## Photography & Imagery

* Style: Cinematic, warm, golden-hour lighting preferred
* Color grading: Warm tones that complement Indigo and Gold
* Composition: Rule of thirds, generous negative space
* People: Diverse, candid creative moments, natural expressions
* Products: Hero shots on brand-colored backgrounds, premium quality
* Places: Inspiring creative spaces, atmospheric lighting
* Never use oversaturated, cold-toned, or generic stock photography
* Illustrations: Geometric-organic hybrid style matching the logo philosophy

--------------

## Motion & Animation

* Default transition: 200–300ms ease
* Page transitions: Fade with subtle upward movement
* Scroll animations: Elements fade in from below, staggered timing
* Signature effect: "Golden Reveal" — elements trace in with a gold line before filling
* Keep animations subtle and purposeful — never purely decorative
* Reduce motion for users with prefers-reduced-motion enabled
* Trailing stars: Nav bar hover only, gold particles, 150ms fade

-->