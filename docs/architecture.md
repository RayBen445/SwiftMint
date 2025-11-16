# SwiftMint Architecture

## Overview

SwiftMint is a modern fintech application built with a serverless architecture optimized for Vercel deployment. The platform enables instant global micro-payments with ultra-low fees.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel Platform                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐       ┌──────────────────┐       │
│  │   Frontend       │       │   API Functions   │       │
│  │   React + Vite   │◄─────►│   Serverless     │       │
│  │   Tailwind CSS   │       │   Node.js + TS   │       │
│  └──────────────────┘       └──────────────────┘       │
│           │                          │                   │
│           │                          │                   │
│           ▼                          ▼                   │
│  ┌──────────────────┐       ┌──────────────────┐       │
│  │  Static Assets   │       │  Mock Data Store │       │
│  │  (CDN)           │       │  (In-Memory)     │       │
│  └──────────────────┘       └──────────────────┘       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first styling
- **React Router**: Client-side routing

### Folder Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── BalanceCard.tsx
│   │   ├── CurrencySelector.tsx
│   │   ├── QuickActions.tsx
│   │   ├── TransactionList.tsx
│   │   └── Navbar.tsx
│   ├── pages/          # Route-level components
│   │   ├── Home.tsx
│   │   ├── Send.tsx
│   │   ├── Request.tsx
│   │   ├── Convert.tsx
│   │   └── History.tsx
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions & API client
│   └── App.tsx         # Root component
└── package.json
```

### Component Design Principles
1. **Composition**: Small, reusable components
2. **Type Safety**: Full TypeScript coverage
3. **Accessibility**: WCAG 2.1 compliant
4. **Responsive**: Mobile-first design

## Backend Architecture

### API Structure
The backend uses Vercel's serverless functions for zero-config deployment.

```
api/
├── send.ts           # Send money endpoint
├── receive.ts        # Create payment requests
├── convert.ts        # Currency conversion
├── rates.ts          # Exchange rates
└── transactions.ts   # Transaction history
```

### API Endpoints

#### POST /api/send
Send money to another wallet
- **Input**: fromWallet, toWallet, amount, currency, note
- **Output**: Transaction object with fee calculation

#### POST /api/receive
Create a payment request
- **Input**: walletId, amount, currency, note
- **Output**: Payment request with QR code and link

#### POST /api/convert
Convert between currencies
- **Input**: fromCurrency, toCurrency, amount
- **Output**: Conversion result with rate and fees

#### GET /api/rates
Get current exchange rates
- **Query**: base (optional), currencies (optional)
- **Output**: Exchange rates object

#### GET /api/transactions
Get transaction history
- **Query**: walletId, type, status, limit, offset
- **Output**: Paginated transaction list

## Data Flow

### Send Money Flow
```
User Input → Form Validation → API Call → Fee Calculation → 
Transaction Creation → Response → UI Update
```

### Currency Conversion Flow
```
User Input → Rate Lookup → Conversion Calculation → 
Fee Application → Result Display
```

### Transaction History Flow
```
Page Load → API Request → Data Fetch → Filter Application → 
List Rendering
```

## Security Considerations

1. **Input Validation**: All API inputs are validated
2. **Type Safety**: TypeScript ensures type correctness
3. **Error Handling**: Comprehensive error handling throughout
4. **Rate Limiting**: Future implementation planned
5. **HTTPS Only**: Enforced by Vercel

## Scalability

### Current Implementation
- Stateless serverless functions
- In-memory mock data
- Unlimited concurrent requests (Vercel limits apply)

### Future Enhancements
1. Database integration (PostgreSQL/MongoDB)
2. Redis caching layer
3. Message queue for async processing
4. Microservices architecture
5. WebSocket for real-time updates

## Performance Optimizations

1. **Code Splitting**: Automatic via Vite
2. **Lazy Loading**: Route-based code splitting
3. **CDN Delivery**: Static assets via Vercel Edge Network
4. **Serverless Cold Start**: Minimal dependencies
5. **Bundle Size**: Optimized production builds

## Monitoring & Observability

### Planned Integrations
- **Sentry**: Error tracking
- **Google Analytics**: Usage analytics
- **Vercel Analytics**: Performance monitoring
- **Custom Logging**: Structured logging system

## Deployment Strategy

1. **Development**: Local development with Vite HMR
2. **Preview**: Automatic preview deployments per PR
3. **Production**: Main branch auto-deploys
4. **Rollback**: Instant rollback via Vercel dashboard

## Technology Decisions

### Why Vercel?
- Zero-config serverless
- Automatic HTTPS
- Global CDN
- Preview deployments
- Built-in analytics

### Why React + TypeScript?
- Type safety reduces bugs
- Large ecosystem
- Excellent DX
- Component reusability

### Why Tailwind CSS?
- Rapid development
- Consistent design system
- Small bundle size
- Easy customization

### Why Serverless?
- No server management
- Auto-scaling
- Pay-per-use
- Global distribution
