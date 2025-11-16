# SwiftMint 🚀

**Ultra-Low Fees. Instant Transfers. Global Reach.**

SwiftMint is a modern fintech platform focused on instant global micro-payments with ultra-low fees. Built with cutting-edge technology and deployed on Vercel's edge network for maximum performance.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/SwiftMint)

---

## 🌟 Features

### Core Capabilities
- 💸 **Send Money** - Transfer funds to anyone, anywhere in seconds
- 💰 **Receive Payments** - Accept payments with zero hassle
- 🔄 **Currency Conversion** - Exchange currencies at competitive rates
- 👛 **Multi-Currency Wallets** - Hold multiple currencies in separate pockets
- 📊 **Transaction History** - Track all your payments in one place
- 🌍 **Global Reach** - Support for 8+ major currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY)

### Key Benefits
- **Ultra-Low Fees**: Only 0.1% per transaction (minimum $0.01)
- **Instant Processing**: Transactions complete in seconds
- **Real-Time Rates**: Live exchange rates updated continuously
- **Secure**: Built with security best practices
- **Scalable**: Serverless architecture scales automatically

---

## 📸 Screenshots

*Coming soon - screenshots of the application*

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Express (local) / Vercel Serverless Functions (production)
- **API Style**: RESTful
- **Data Storage**: In-memory (MVP) → MongoDB (planned)

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions (optional)
- **Deployment**: Automatic via Git push

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest (backend), Vitest (frontend)
- **Type Checking**: TypeScript

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/SwiftMint.git
   cd SwiftMint
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Run the backend** (in one terminal)
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

4. **Run the frontend** (in another terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📦 Project Structure

```
SwiftMint/
├── api/                      # Vercel serverless API functions
│   ├── send.ts              # Send money endpoint
│   ├── receive.ts           # Receive money endpoint
│   ├── convert.ts           # Currency conversion endpoint
│   ├── rates.ts             # Exchange rates endpoint
│   └── transactions.ts      # Transaction history endpoint
│
├── backend/                 # Backend service (Express)
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration
│   │   └── index.ts         # Entry point
│   ├── tests/               # Backend tests
│   ├── Dockerfile           # Backend container
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # Frontend application (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── CurrencySelector.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── Layout.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SendMoneyPage.tsx
│   │   │   ├── RequestMoneyPage.tsx
│   │   │   ├── ConvertCurrencyPage.tsx
│   │   │   └── TransactionHistoryPage.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend container
│   ├── nginx.conf           # Nginx configuration
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── modules/                 # Future feature modules
│   ├── MintCard/           # Virtual/physical card module
│   ├── MintPayBusiness/    # Business payment processing
│   └── MintAPI/            # Developer API integration
│
├── docs/                    # Documentation
│   ├── architecture.md      # System architecture
│   ├── api-endpoints.md     # API documentation
│   ├── user-flow.md         # User journey documentation
│   ├── roadmap.md           # Product roadmap
│   └── deployment.md        # Deployment guide
│
├── branding/                # Brand assets
│   ├── logo-concept.md      # Logo design concepts
│   ├── color-palette.md     # Color system
│   └── slogan-ideas.md      # Brand messaging
│
├── .github/                 # GitHub configuration
│   └── workflows/           # CI/CD workflows
│
├── vercel.json              # Vercel configuration
├── .gitignore               # Git ignore rules
├── .env.example             # Environment variables template
├── package.json             # Root package configuration
└── README.md                # This file
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# API Configuration
EXCHANGE_RATE_SOURCE=https://api.exchangerate-api.com
API_SECRET_KEY=your-secret-key-here
DATABASE_URL=mongodb://localhost:27017/swiftmint

# Frontend (optional)
VITE_API_URL=/api
```

For Vercel deployment, add these variables in the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments
3. Use `vercel env add` CLI command for automation

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

---

## 🎨 Development

### Linting
```bash
# Backend
cd backend
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues

# Frontend
cd frontend
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues
```

### Formatting
```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Building
```bash
# Backend
cd backend
npm run build            # Compiles TypeScript to dist/

# Frontend
cd frontend
npm run build            # Builds to dist/
npm run preview          # Preview production build
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Via Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure environment variables
6. Click "Deploy"

#### Option 2: Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add EXCHANGE_RATE_SOURCE production
vercel env add API_SECRET_KEY production
vercel env add DATABASE_URL production

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Deploy with Docker

#### Backend
```bash
cd backend
docker build -t swiftmint-backend .
docker run -p 3000:3000 --env-file .env swiftmint-backend
```

#### Frontend
```bash
cd frontend
docker build -t swiftmint-frontend .
docker run -p 80:80 swiftmint-frontend
```

#### Docker Compose
```bash
docker-compose up -d
```

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

---

## 📚 Documentation

- **[Architecture](docs/architecture.md)** - System design and technical architecture
- **[API Endpoints](docs/api-endpoints.md)** - Complete API reference
- **[User Flow](docs/user-flow.md)** - User journey documentation
- **[Roadmap](docs/roadmap.md)** - Product development roadmap
- **[Deployment](docs/deployment.md)** - Deployment guide for Vercel and Docker

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Core payment functionality
- [x] Multi-currency support
- [x] Transaction history
- [x] Responsive design
- [x] Vercel deployment

### Phase 2: Beta Launch (Q2 2024)
- [ ] Real database integration
- [ ] JWT authentication
- [ ] Email/SMS notifications
- [ ] Transaction receipts
- [ ] 2FA security

### Phase 3: Public Launch (Q3 2024)
- [ ] Bank account linking
- [ ] Payment methods (cards, PayPal)
- [ ] Recurring payments
- [ ] QR code payments
- [ ] Mobile apps

### Phase 4: Growth (Q4 2024)
- [ ] 50+ currencies
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for developers

### Phase 5: Platform Expansion (2025)
- [ ] MintCard (virtual/physical cards)
- [ ] MintPay Business (merchant tools)
- [ ] MintAPI (developer platform)
- [ ] Investment features

See [docs/roadmap.md](docs/roadmap.md) for the complete roadmap.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Development**: SwiftMint Team
- **Design**: SwiftMint Design Team
- **Product**: SwiftMint Product Team

---

## 📞 Support

- **Email**: support@swiftmint.com
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/SwiftMint/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/SwiftMint/discussions)

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vercel](https://vercel.com/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Emoji](https://emojipedia.org/)

---

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

---

**Made with ❤️ by the SwiftMint Team**