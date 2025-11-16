# SwiftMint Architecture

## System Overview

SwiftMint is a modern fintech platform built with a serverless-first architecture, optimized for global deployment on Vercel.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React + TypeScript)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Home   │  │   Send   │  │ Convert  │  │ History  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│         ▼ Components + Hooks + State Management             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS / REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│              (Vercel Serverless Functions)                   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  /send   │  │ /receive │  │ /convert │  │  /rates  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           /transactions                               │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Service Layer
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic                             │
│                   (Backend Services)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Auth      │  │   Wallet     │  │ Transaction  │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Currency   │  │ Rate Optimizer│                        │
│  │   Service    │  │   (Future)   │                        │
│  └──────────────┘  └──────────────┘                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Data Persistence
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   MongoDB    │  │    Redis     │  │  S3 Storage  │     │
│  │  (Database)  │  │   (Cache)    │  │  (Documents) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Fetch API

### Backend (API)
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: Vercel Serverless Functions
- **Alternative**: Express (for local development)

### Infrastructure
- **Hosting**: Vercel (frontend + serverless API)
- **CDN**: Vercel Edge Network
- **Database**: MongoDB Atlas (planned)
- **Caching**: Redis (planned)
- **Storage**: AWS S3 (planned)

## Key Design Patterns

### 1. Serverless Architecture
- Each API endpoint is an independent function
- Auto-scaling based on demand
- Pay-per-execution pricing
- Zero maintenance overhead

### 2. Service Layer Pattern
```typescript
Controller → Service → Model → Data Store
```
- Controllers handle HTTP requests/responses
- Services contain business logic
- Models define data structures
- Clear separation of concerns

### 3. Mock Data Layer (Current)
```typescript
// In-memory storage for MVP
export const transactions: Map<string, Transaction> = new Map();
```
- Fast development iteration
- Easy to replace with real database
- No external dependencies for demo

### 4. Currency Conversion Pipeline
```
User Request → Rate Fetch → Calculation → Optimization → Execution
```
- Real-time rate fetching
- Rate optimizer compares multiple sources
- Transaction record created
- Wallet balances updated atomically

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Stateless operations

### Endpoint Structure
```
POST   /api/send         - Send money
POST   /api/receive      - Receive payment
POST   /api/convert      - Convert currency
GET    /api/rates        - Get exchange rates
GET    /api/transactions - List transactions
```

## Security Architecture

### Authentication (Planned)
- JWT-based authentication
- HTTP-only cookies
- Token refresh mechanism
- 2FA support

### API Security
- Rate limiting per IP
- Input validation
- SQL injection prevention
- XSS protection via React
- CORS configuration

### Data Security
- Encryption at rest
- Encryption in transit (HTTPS)
- PCI compliance (future)
- Regular security audits

## Scalability Strategy

### Horizontal Scaling
- Serverless functions scale automatically
- No server provisioning needed
- Global edge deployment

### Caching Strategy
```
1. CDN cache (Vercel Edge)
2. Application cache (Redis)
3. Database queries (MongoDB indexes)
```

### Database Optimization
- Indexed queries
- Connection pooling
- Read replicas
- Sharding (for growth)

## Deployment Pipeline

```
Code Push → GitHub → Vercel Build → Deploy to Edge
                ↓
         Run Tests
                ↓
         Type Check
                ↓
         Build Assets
                ↓
         Deploy Preview
                ↓
    Merge to Main → Production
```

## Monitoring & Observability

### Metrics (Planned)
- Transaction volume
- API latency
- Error rates
- User engagement

### Logging
- Structured logs
- Request/response tracking
- Error tracking
- Performance monitoring

### Alerts
- High error rates
- Slow API responses
- Failed transactions
- Security incidents

## Future Enhancements

1. **Microservices**: Break down into smaller services
2. **Event-Driven**: Use message queues (RabbitMQ, Kafka)
3. **GraphQL**: Alternative to REST API
4. **Mobile Apps**: React Native apps
5. **Blockchain**: Crypto payment integration
6. **AI/ML**: Fraud detection, rate prediction

## Development Workflow

```
Local Development (npm run dev)
      ↓
Feature Branch
      ↓
Pull Request
      ↓
Code Review
      ↓
CI/CD Pipeline
      ↓
Staging Deployment
      ↓
Production Deployment
```
