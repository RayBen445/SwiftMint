# Deployment Guide

This guide covers deploying SwiftMint to Vercel, the recommended platform for this application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Vercel account (free tier works great)

## Quick Start Deployment

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   cd /path/to/SwiftMint
   vercel
   ```

4. **Follow the prompts:**
   - Setup and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **swiftmint**
   - In which directory is your code located? **./**
   - Want to override the settings? **N**

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial SwiftMint deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project settings (see below)
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` → Production deployment
   - Every PR → Preview deployment

## Project Configuration

### Build Settings

Vercel will automatically detect the configuration from `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "frontend/dist" }
    }
  ]
}
```

### Environment Variables

#### Required Variables
None currently required (using mock data)

#### Optional Variables
Set these in Vercel Dashboard → Settings → Environment Variables:

**Production:**
```bash
# API Configuration
API_SECRET_KEY=your_production_secret

# Exchange Rate API (future)
EXCHANGE_RATE_API_KEY=your_api_key

# Database (future)
DATABASE_URL=your_production_db_url

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

**Preview & Development:**
```bash
# Use test/development values
API_SECRET_KEY=dev_secret_key
EXCHANGE_RATE_API_KEY=test_api_key
```

#### Setting Environment Variables via CLI
```bash
# Production
vercel env add API_SECRET_KEY production

# Preview
vercel env add API_SECRET_KEY preview

# Development
vercel env add API_SECRET_KEY development
```

## Domain Configuration

### Using Vercel Domain
Your app will be available at: `your-project.vercel.app`

### Using Custom Domain

1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Configure DNS**
   Add the following records to your DNS provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - HTTPS enforced by default

## Deployment Verification

### Check Deployment Status

```bash
# List recent deployments
vercel ls

# Check deployment logs
vercel logs <deployment-url>
```

### Test Endpoints

```bash
# Test API endpoints
curl https://your-app.vercel.app/api/rates
curl https://your-app.vercel.app/api/transactions

# Test frontend
open https://your-app.vercel.app
```

### Monitor Performance
- Visit Vercel Dashboard → Analytics
- Check response times
- Monitor error rates
- View bandwidth usage

## CI/CD Pipeline

### GitHub Actions Integration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install Frontend Dependencies
        run: cd frontend && npm ci
      
      - name: Install API Dependencies
        run: cd api && npm ci
      
      - name: Build Frontend
        run: cd frontend && npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Strategy

### Instant Rollback

1. **Via Dashboard**
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**
   ```bash
   # List deployments
   vercel ls
   
   # Promote specific deployment
   vercel promote <deployment-url>
   ```

### Version Pinning
- Always use `vercel.json` for configuration
- Keep `package-lock.json` in version control
- Document breaking changes in CHANGELOG.md

## Monitoring & Debugging

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Specific deployment logs
vercel logs <deployment-url>

# Function logs
vercel logs <deployment-url> --output=json
```

### Error Tracking

1. **Enable Vercel Analytics**
   - Automatic error tracking
   - Performance metrics
   - User analytics

2. **Integrate Sentry** (optional)
   ```bash
   npm install @sentry/react @sentry/node
   ```
   Configure in your app for detailed error reporting

### Performance Monitoring

- **Vercel Analytics**: Built-in performance metrics
- **Lighthouse**: Run audits regularly
- **Real User Monitoring**: Track actual user experience

## Cost Optimization

### Vercel Free Tier Limits
- 100 GB bandwidth/month
- 100 GB-hours serverless execution
- Unlimited deployments
- Unlimited team members

### Optimization Tips

1. **Reduce Bundle Size**
   ```bash
   # Analyze bundle
   cd frontend
   npm run build -- --analyze
   ```

2. **Optimize Images**
   - Use WebP format
   - Implement lazy loading
   - Use Next.js Image component (if migrating)

3. **Cache Strategies**
   - Static assets: 1 year cache
   - API responses: Short TTL caching
   - CDN edge caching

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Check build locally
cd frontend
npm run build

# Check for TypeScript errors
npm run type-check
```

**API Not Working**
- Verify `vercel.json` routes configuration
- Check function logs: `vercel logs`
- Test endpoints locally first

**Environment Variables Not Working**
- Ensure variables are set for correct environment
- Restart deployment after adding variables
- Check variable names match exactly

### Getting Help

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Vercel Support**: Email support@vercel.com
3. **Community**: Vercel Discord or GitHub Discussions

## Production Checklist

Before going to production:

- [ ] All environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] API endpoints tested
- [ ] Frontend tested on multiple devices
- [ ] Performance audit completed (Lighthouse)
- [ ] Security headers configured
- [ ] Rate limiting planned/implemented
- [ ] Backup strategy defined
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team access configured

## Continuous Deployment Workflow

```
Developer Push → GitHub → Vercel Build → 
Preview Deployment → Tests Pass → 
Manual Approval → Production Deployment → 
Monitoring
```

### Best Practices

1. **Use Preview Deployments**
   - Test every PR before merging
   - Share preview URLs with team
   - Verify changes in production-like environment

2. **Gradual Rollouts**
   - Deploy to preview first
   - Test thoroughly
   - Deploy to production during low-traffic hours
   - Monitor for issues

3. **Version Control**
   - Tag releases: `git tag v1.0.0`
   - Keep detailed CHANGELOG
   - Document breaking changes

4. **Monitoring**
   - Set up alerts for errors
   - Monitor performance metrics
   - Track user feedback

## Advanced Configuration

### Custom Build Command

In `vercel.json`:
```json
{
  "buildCommand": "cd frontend && npm run build"
}
```

### Custom Install Command

```json
{
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Edge Functions

For faster response times, consider migrating to Edge Functions:
```typescript
export const config = {
  runtime: 'edge',
};
```

## Scaling Considerations

### Current Architecture
- Stateless serverless functions
- Auto-scaling by default
- No database (mock data)

### Future Scaling Path
1. Add database (Vercel Postgres/MongoDB Atlas)
2. Implement caching (Vercel KV/Redis)
3. Add CDN for static assets (already included)
4. Consider rate limiting
5. Implement background jobs (Vercel Cron)

---

## Summary

SwiftMint is optimized for Vercel deployment with zero configuration. The platform handles:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-scaling
- ✅ Preview deployments
- ✅ Zero-downtime deployments

Deploy with confidence! 🚀
