# SwiftMint Color Palette

## Brand Philosophy

Our color palette reflects SwiftMint's core values:
- **Trust & Security** - Blue tones
- **Energy & Speed** - Vibrant accents
- **Modern & Fresh** - Mint greens
- **Professional** - Balanced neutrals

---

## Primary Colors

### Primary Blue
**Color:** Electric Blue
- **Hex:** `#0EA5E9`
- **RGB:** `rgb(14, 165, 233)`
- **HSL:** `hsl(199, 89%, 48%)`
- **Tailwind:** `sky-500`

**Usage:**
- Primary buttons
- Links
- Active states
- Logo primary color
- Call-to-action elements

**Accessibility:**
- WCAG AA: ✅ Pass on white (4.5:1)
- WCAG AAA: ⚠️ Use with caution (3.1:1)

---

### Primary Blue (Dark)
**Color:** Deep Ocean Blue
- **Hex:** `#0369A1`
- **RGB:** `rgb(3, 105, 161)`
- **HSL:** `hsl(199, 96%, 32%)`
- **Tailwind:** `sky-700`

**Usage:**
- Hover states
- Dark mode primary
- Text on light backgrounds
- Navigation highlights

**Accessibility:**
- WCAG AA: ✅ Pass on white (7.2:1)
- WCAG AAA: ✅ Pass on white (7.2:1)

---

### Secondary Accent
**Color:** Purple Dream
- **Hex:** `#D946EF`
- **RGB:** `rgb(217, 70, 239)`
- **HSL:** `hsl(292, 84%, 61%)`
- **Tailwind:** `fuchsia-500`

**Usage:**
- Special features
- Promotions
- Highlights
- Gradient accents
- Secondary buttons

---

## Success/Error Colors

### Success Green
**Color:** Fresh Mint
- **Hex:** `#10B981`
- **RGB:** `rgb(16, 185, 129)`
- **HSL:** `hsl(160, 84%, 39%)`
- **Tailwind:** `emerald-500`

**Usage:**
- Success messages
- Completed transactions
- Positive balances
- Receive transactions
- Confirmation badges

---

### Warning Yellow
**Color:** Sunshine Alert
- **Hex:** `#F59E0B`
- **RGB:** `rgb(245, 158, 11)`
- **HSL:** `hsl(38, 92%, 50%)`
- **Tailwind:** `amber-500`

**Usage:**
- Pending status
- Warning messages
- Important notices
- Attention required

---

### Error Red
**Color:** Critical Alert
- **Hex:** `#EF4444`
- **RGB:** `rgb(239, 68, 68)`
- **HSL:** `hsl(0, 84%, 60%)`
- **Tailwind:** `red-500`

**Usage:**
- Error messages
- Failed transactions
- Validation errors
- Destructive actions
- Send transactions (negative)

---

## Neutral Colors

### Dark Text
**Color:** Charcoal
- **Hex:** `#1F2937`
- **RGB:** `rgb(31, 41, 55)`
- **HSL:** `hsl(217, 28%, 17%)`
- **Tailwind:** `gray-800`

**Usage:**
- Primary text
- Headings
- Important content
- High emphasis

---

### Medium Text
**Color:** Steel Gray
- **Hex:** `#6B7280`
- **RGB:** `rgb(107, 114, 128)`
- **HSL:** `hsl(220, 9%, 46%)`
- **Tailwind:** `gray-500`

**Usage:**
- Secondary text
- Descriptions
- Placeholders
- Medium emphasis

---

### Light Text
**Color:** Soft Gray
- **Hex:** `#9CA3AF`
- **RGB:** `rgb(156, 163, 175)`
- **HSL:** `hsl(220, 9%, 65%)`
- **Tailwind:** `gray-400`

**Usage:**
- Disabled text
- Timestamps
- Subtle information
- Low emphasis

---

### Background Colors

#### Light Background
- **Hex:** `#F9FAFB`
- **Tailwind:** `gray-50`
- **Usage:** Page backgrounds, cards on light mode

#### White
- **Hex:** `#FFFFFF`
- **Usage:** Card backgrounds, modals, primary surfaces

#### Dark Background
- **Hex:** `#0F172A`
- **Tailwind:** `slate-900`
- **Usage:** Dark mode backgrounds

---

## Gradients

### Primary Gradient
**Name:** Ocean Breeze
```css
background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%);
```
**Usage:**
- Hero sections
- Balance cards
- Feature highlights
- Primary CTAs

---

### Accent Gradient
**Name:** Purple Dream
```css
background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%);
```
**Usage:**
- Special promotions
- Premium features
- Secondary CTAs
- Accent cards

---

### Success Gradient
**Name:** Fresh Start
```css
background: linear-gradient(135deg, #10B981 0%, #059669 100%);
```
**Usage:**
- Success states
- Positive trends
- Growth indicators
- Receive cards

---

### Multi-color Gradient
**Name:** Rainbow Flow
```css
background: linear-gradient(135deg, #0EA5E9 0%, #D946EF 50%, #10B981 100%);
```
**Usage:**
- Marketing materials
- Celebrations
- Special events
- Brand hero images

---

## Color Scale (Tailwind Extended)

### Primary Blue Scale
- 50: `#F0F9FF`
- 100: `#E0F2FE`
- 200: `#BAE6FD`
- 300: `#7DD3FC`
- 400: `#38BDF8`
- **500: `#0EA5E9`** (Primary)
- 600: `#0284C7`
- 700: `#0369A1`
- 800: `#075985`
- 900: `#0C4A6E`

### Accent Purple Scale
- 50: `#FDF4FF`
- 100: `#FAE8FF`
- 200: `#F5D0FE`
- 300: `#F0ABFC`
- 400: `#E879F9`
- **500: `#D946EF`** (Accent)
- 600: `#C026D3`
- 700: `#A21CAF`
- 800: `#86198F`
- 900: `#701A75`

---

## Dark Mode Colors

### Dark Backgrounds
- **Primary:** `#0F172A` (slate-900)
- **Secondary:** `#1E293B` (slate-800)
- **Elevated:** `#334155` (slate-700)

### Dark Text
- **Primary:** `#F1F5F9` (slate-100)
- **Secondary:** `#CBD5E1` (slate-300)
- **Tertiary:** `#94A3B8` (slate-400)

### Dark Borders
- **Default:** `#334155` (slate-700)
- **Subtle:** `#1E293B` (slate-800)

---

## Accessibility Guidelines

### Contrast Ratios (WCAG 2.1)

#### AA Compliance (Minimum)
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

#### AAA Compliance (Enhanced)
- Normal text: 7:1
- Large text: 4.5:1

### Our Compliance

✅ **Primary Blue (#0EA5E9) on White:**
- Ratio: 3.1:1 (AA for large text only)
- Use for headings, buttons, not body text

✅ **Dark Blue (#0369A1) on White:**
- Ratio: 7.2:1 (AAA compliant)
- Safe for all text sizes

✅ **Charcoal (#1F2937) on White:**
- Ratio: 14.4:1 (AAA compliant)
- Ideal for body text

---

## Color Combinations

### Recommended Pairings

#### Professional & Trustworthy
- Background: White
- Text: Charcoal (#1F2937)
- Accent: Primary Blue (#0EA5E9)

#### Bold & Modern
- Background: Dark (#0F172A)
- Text: White
- Accent: Purple (#D946EF)

#### Fresh & Friendly
- Background: Light Gray (#F9FAFB)
- Text: Steel Gray (#6B7280)
- Accent: Mint Green (#10B981)

---

## Usage Examples

### Buttons

**Primary Button**
```css
background: #0EA5E9;
color: white;
hover: #0284C7;
```

**Secondary Button**
```css
background: #F3F4F6;
color: #1F2937;
hover: #E5E7EB;
```

**Success Button**
```css
background: #10B981;
color: white;
hover: #059669;
```

---

### Transaction Types

**Send (Outgoing)**
- Icon: Red (#EF4444)
- Amount: Red (#DC2626)
- Background: Red tint (#FEE2E2)

**Receive (Incoming)**
- Icon: Green (#10B981)
- Amount: Green (#059669)
- Background: Green tint (#D1FAE5)

**Convert**
- Icon: Purple (#D946EF)
- Amount: Purple (#C026D3)
- Background: Purple tint (#FAE8FF)

---

### Status Badges

**Completed**
```css
background: #D1FAE5;
color: #065F46;
border: #10B981;
```

**Pending**
```css
background: #FEF3C7;
color: #92400E;
border: #F59E0B;
```

**Failed**
```css
background: #FEE2E2;
color: #991B1B;
border: #EF4444;
```

---

## Brand Applications

### Website
- **Header:** White background, dark text
- **Hero:** Gradient background (Ocean Breeze)
- **Cards:** White with subtle shadow
- **Footer:** Dark background (#1F2937)

### Mobile App
- **Bottom Nav:** White/Dark based on theme
- **Active Tab:** Primary Blue
- **Inactive Tab:** Gray
- **Floating Action:** Gradient

### Marketing
- **Primary:** Blue (#0EA5E9)
- **Accent:** Purple (#D946EF)
- **Background:** White or gradient
- **Text:** Dark (#1F2937)

---

## Color Psychology

### Blue (Primary)
- **Emotion:** Trust, security, stability
- **Industry:** Financial services
- **Effect:** Calming, professional
- **Perfect for:** Banking, payments, finance

### Purple (Accent)
- **Emotion:** Luxury, creativity, innovation
- **Industry:** Tech, premium services
- **Effect:** Sophisticated, modern
- **Perfect for:** Premium features, special offers

### Green (Success)
- **Emotion:** Growth, health, positive
- **Industry:** Finance, wellness
- **Effect:** Reassuring, fresh
- **Perfect for:** Success states, receive actions

---

## Export Formats

### For Designers
```json
{
  "primary-500": "#0EA5E9",
  "primary-700": "#0369A1",
  "accent-500": "#D946EF",
  "success-500": "#10B981",
  "warning-500": "#F59E0B",
  "error-500": "#EF4444",
  "gray-800": "#1F2937",
  "gray-500": "#6B7280"
}
```

### For Developers (CSS Variables)
```css
:root {
  --color-primary: #0EA5E9;
  --color-primary-dark: #0369A1;
  --color-accent: #D946EF;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-text: #1F2937;
  --color-text-secondary: #6B7280;
}
```

---

## Testing Tools

### Contrast Checkers
- WebAIM Contrast Checker
- Coolors Contrast Checker
- Adobe Color Accessibility Tools

### Color Blindness Simulators
- Coblis — Color Blindness Simulator
- Color Oracle
- Chrome DevTools

---

## Revision History

- **v1.0** - December 2024 - Initial palette
- **v1.1** - Future - Dark mode refinements
- **v2.0** - Future - Brand evolution

---

**Status:** Active
**Last Updated:** December 2024
**Next Review:** March 2025
