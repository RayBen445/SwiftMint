# SwiftMint Deployment Quick Guide

## 🚀 Deploy to Vercel in 3 Steps

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

### Step 3: Done! 🎉
Your app will be live at: `https://your-project.vercel.app`

---

## Alternative: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## What Gets Deployed

### Frontend (Static Build)
- Location: `frontend/dist/`
- Build command: `npm run build`
- Output: Optimized React app

### API Functions (Serverless)
- Location: `api/*.ts`
- Runtime: Node.js 18
- Auto-scaling: Yes

---

## Environment Variables (Optional)

Currently using mock data, so no env vars required for MVP.

For future production:
```bash
API_SECRET_KEY=your_secret
EXCHANGE_RATE_API_KEY=your_key
DATABASE_URL=your_db_url
```

Set in Vercel Dashboard → Settings → Environment Variables

---

## Verification Checklist

After deployment:
- [ ] Visit your app URL
- [ ] Test home page loads
- [ ] Try send money form
- [ ] Test currency conversion
- [ ] Check transaction history
- [ ] Verify all pages work

---

## Troubleshooting

### Build Fails
```bash
cd frontend
npm run build
```
Fix any errors locally first.

### API Not Working
- Check `vercel.json` routes
- Verify function files exist in `/api`
- Check Vercel function logs

### 404 Errors
- Ensure `vercel.json` has proper rewrites
- Check build output directory

---

## Performance Tips

1. **Enable Vercel Analytics** - Free performance monitoring
2. **Use Vercel KV** - For caching (when adding database)
3. **Optimize Images** - Use WebP format
4. **Enable Compression** - Automatic on Vercel

---

## Monitoring

### Vercel Dashboard
- View deployments
- Check analytics
- Monitor errors
- View function logs

### Custom Domain
1. Add domain in Vercel settings
2. Update DNS records
3. SSL auto-configured

---

## Cost

### Vercel Free Tier
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Preview deployments

Perfect for MVP!

---

## Next Steps

1. Deploy and test
2. Gather user feedback
3. Add authentication
4. Integrate database
5. Implement real payments

---

## Support

- 📖 Full Guide: [docs/deployment.md](docs/deployment.md)
- 🐛 Issues: [GitHub Issues](https://github.com/RayBen445/SwiftMint/issues)
- 💬 Questions: Open a discussion

---

**Ready to deploy? Just push to GitHub and import to Vercel!** 🚀
