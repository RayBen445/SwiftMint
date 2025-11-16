# SwiftMint Deployment Guide

## Overview
This guide covers deploying SwiftMint to Vercel, including both the frontend (React) and serverless API functions.

---

## Prerequisites

### Required Tools
- Node.js 20.x or higher
- npm or yarn
- Git
- Vercel CLI (optional, but recommended)

### Accounts Needed
- GitHub account
- Vercel account (free tier works for testing)

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SwiftMint.git
cd SwiftMint
```

### 2. Install Dependencies

**Install all dependencies:**
```bash
npm run install:all
```

**Or install individually:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Variables

**Backend** (optional for local dev):
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**Root** (for Vercel deployment):
```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run Development Servers

**Backend (Express server):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Frontend (Vite dev server):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

The frontend Vite server is configured to proxy API requests to the backend:
- Frontend: `http://localhost:5173`
- API (proxied): `http://localhost:5173/api/*` → `http://localhost:3000/api/*`

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `SwiftMint` repository

#### Step 2: Configure Project
Vercel will auto-detect the configuration from `vercel.json`. Verify settings:

**Framework Preset:** Other

**Root Directory:** `./`

**Build Command:** `npm run vercel-build`

**Output Directory:** `frontend/dist`

**Install Command:** `cd frontend && npm install`

#### Step 3: Environment Variables
Add environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following variables:

**Production:**
```
EXCHANGE_RATE_SOURCE=https://api.exchangerate-api.com
API_SECRET_KEY=your-production-secret-key
DATABASE_URL=your-production-mongodb-url
```

**Preview (optional):**
```
EXCHANGE_RATE_SOURCE=https://api.exchangerate-api.com
API_SECRET_KEY=your-preview-secret-key
DATABASE_URL=your-preview-mongodb-url
```

**Development (optional):**
```
EXCHANGE_RATE_SOURCE=https://api.exchangerate-api.com
API_SECRET_KEY=your-dev-secret-key
DATABASE_URL=your-dev-mongodb-url
```

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Link Project
```bash
vercel link
```
Follow the prompts to create a new project or link to an existing one.

#### Step 4: Add Environment Variables
```bash
vercel env add EXCHANGE_RATE_SOURCE production
vercel env add API_SECRET_KEY production
vercel env add DATABASE_URL production
```

Enter the values when prompted.

#### Step 5: Deploy Preview
```bash
vercel
```
This deploys to a preview URL for testing.

#### Step 6: Deploy Production
```bash
vercel --prod
```
This deploys to your production domain.

---

## Vercel Configuration Explained

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

**Explanation:**
- `builds`: Defines how to build the project
  - Frontend: Static build with Vite
  - API: Serverless Node.js functions
- `routes`: URL routing configuration
  - `/api/*` routes to serverless functions
  - All other routes serve the frontend SPA

### Build Process
1. Install frontend dependencies
2. Run `npm run build` in frontend directory
3. Generate static files in `frontend/dist`
4. Deploy serverless functions from `api/` directory
5. Configure routes for API and frontend

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `swiftmint.com`)

### Step 2: Configure DNS
Add the following DNS records with your domain registrar:

**For apex domain (swiftmint.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify Domain
1. Wait for DNS propagation (up to 48 hours)
2. Vercel will automatically issue SSL certificate
3. Your app will be accessible at your custom domain

---

## Environment-Specific Deployments

### Production
- **Branch**: `main`
- **Domain**: `https://swiftmint.com`
- **Auto-deploy**: Enabled on push to `main`

### Preview/Staging
- **Branch**: Any branch (e.g., `develop`, `feature/*`)
- **Domain**: `https://swiftmint-{branch}.vercel.app`
- **Auto-deploy**: Enabled on push to any branch

### Development
- **Environment**: Local machine
- **Domain**: `http://localhost:5173`

---

## Continuous Integration/Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Type check
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Required Secrets:**
- `VERCEL_TOKEN`: Get from Vercel account settings
- `VERCEL_ORG_ID`: Get from project settings
- `VERCEL_PROJECT_ID`: Get from project settings

---

## Monitoring & Logging

### Vercel Analytics
1. Enable in Project Settings → Analytics
2. View real-time metrics:
   - Visitors
   - Page views
   - Top pages
   - Referrers
   - Devices

### Vercel Logs
```bash
# View deployment logs
vercel logs

# View runtime logs
vercel logs --follow
```

### Error Tracking (Future)
Consider integrating:
- Sentry
- LogRocket
- Datadog

---

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Automatic with Vite
- **Lazy Loading**: Use `React.lazy()` for routes
- **Image Optimization**: Use Vercel Image Optimization
- **Caching**: Configure cache headers

### API Optimization
- **Edge Functions**: Consider for lower latency
- **Caching**: Use Vercel KV for rate data
- **Connection Pooling**: For database connections

### Example: Edge Function
Convert `api/rates.ts` to Edge Runtime:

```typescript
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Your handler code
}
```

---

## Rollback & Recovery

### Rollback to Previous Deployment
```bash
# List deployments
vercel list

# Promote a previous deployment
vercel promote <deployment-url>
```

### In Vercel Dashboard
1. Go to Deployments
2. Find the working deployment
3. Click "..." → "Promote to Production"

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors
```bash
# Solution: Check types locally
cd frontend
npm run build
```

**Issue**: Missing environment variables
```bash
# Solution: Add variables in Vercel dashboard
# or use vercel env add
```

### Runtime Errors

**Issue**: API returns 500 errors
```bash
# Solution: Check Vercel logs
vercel logs --follow
```

**Issue**: CORS errors
```typescript
// Solution: Update CORS config in vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### Performance Issues

**Issue**: Slow API responses
- Check function region configuration
- Consider using Edge Functions
- Implement caching strategy

**Issue**: Large bundle size
```bash
# Solution: Analyze bundle
cd frontend
npm run build -- --mode production
```

---

## Security Best Practices

### API Security
1. ✅ Use environment variables for secrets
2. ✅ Implement rate limiting
3. ✅ Validate all inputs
4. ✅ Use HTTPS only
5. ⚠️ Add authentication to all endpoints (TODO)

### Frontend Security
1. ✅ Content Security Policy headers
2. ✅ HTTPS enforcement
3. ✅ XSS protection (React default)
4. ✅ Secure cookies (when implemented)

### Environment Variables
```bash
# Never commit these files:
.env
.env.local
.env.production
.vercel
```

---

## Cost Optimization

### Vercel Pricing Tiers
- **Hobby**: Free (good for testing)
  - 100 GB bandwidth
  - Serverless function execution
  - Edge functions
  
- **Pro**: $20/month (recommended for production)
  - 1 TB bandwidth
  - Advanced analytics
  - Team features
  
- **Enterprise**: Custom pricing
  - Unlimited bandwidth
  - SLA guarantees
  - Dedicated support

### Cost-Saving Tips
1. Optimize function execution time
2. Implement caching strategies
3. Use CDN for static assets
4. Monitor bandwidth usage

---

## Backup & Disaster Recovery

### Database Backups
- Regular MongoDB Atlas backups (automated)
- Export transaction data weekly
- Store backups in S3

### Code Backups
- GitHub repository (primary)
- Local clones (secondary)
- Vercel deployment history

### Recovery Plan
1. Identify issue
2. Rollback to last working deployment
3. Fix issue in separate branch
4. Test thoroughly
5. Deploy fix

---

## Support & Resources

### Official Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [GitHub Issues](https://github.com/your-username/SwiftMint/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

### Getting Help
1. Check this documentation
2. Search GitHub issues
3. Ask in Vercel Discord
4. Create GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Logs/screenshots

---

## Checklist Before Production

- [ ] Environment variables configured
- [ ] Custom domain setup
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Database backups automated
- [ ] Monitoring alerts setup
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Terms of service published
- [ ] Privacy policy published
- [ ] Support email configured

---

**Last Updated**: January 2024
**Next Review**: Before production launch
