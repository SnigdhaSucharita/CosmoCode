# Frontend Deployment Guide

This guide will help you deploy the Picstoria frontend to production.

## Prerequisites

- Backend API running at https://cosmocode.onrender.com
- Git repository initialized and committed
- Node.js 18+ installed

## Quick Deployment to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub (e.g., picstoria-frontend)
# Then push your code:

git remote add origin https://github.com/YOUR_USERNAME/picstoria-frontend.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `picstoria-frontend` repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://cosmocode.onrender.com`

6. Click "Deploy"

Your frontend will be live in ~2 minutes at `https://your-app.vercel.app`

## Alternative: Deploy to Netlify

### Step 1: Build Configuration

Create `frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Connect to your GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com`
6. Deploy

## Alternative: Docker Deployment

### Step 1: Create Dockerfile

In the `frontend/` directory, create:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2: Update next.config.js

Add to `frontend/next.config.js`:

```javascript
module.exports = {
  output: 'standalone',
  // ... rest of config
}
```

### Step 3: Build and Run

```bash
cd frontend

# Build the Docker image
docker build -t picstoria-frontend .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com picstoria-frontend
```

## Testing the Deployment

After deployment, test these key features:

1. **Homepage**: Visit the root URL, verify public search works
2. **Authentication**:
   - Sign up a new account
   - Verify email (check email or check backend logs)
   - Log in with credentials
3. **Collection**:
   - Save photos from search results
   - View your collection
   - Filter by tags
4. **Photo Detail**:
   - Click on a photo
   - View color palette
   - Add custom tags
   - View recommendations
5. **Search History**: Check your past searches
6. **Dark Mode**: Toggle between light and dark themes
7. **Mobile**: Test on mobile device or resize browser

## Environment Variables

### Required

- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., https://cosmocode.onrender.com)

### Optional

None required for basic functionality.

## Troubleshooting

### Issue: API requests fail with CORS errors

**Solution**: Ensure the backend is configured to accept requests from your frontend domain. The backend should have CORS enabled for your Vercel/Netlify URL.

### Issue: Images don't load

**Solution**: Check that `next.config.js` has `remotePatterns` configured for image domains:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

### Issue: Build fails

**Solution**:
1. Check Node.js version (must be 18+)
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Try building locally: `npm run build`

### Issue: Authentication doesn't work

**Solution**:
1. Verify cookies are enabled in browser
2. Check that API URL is correct in environment variables
3. Ensure backend and frontend are on same domain (or CORS is properly configured)

## Performance Optimization

The frontend is already optimized with:
- ✅ Server-Side Rendering (SSR)
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Static asset caching
- ✅ Gzip compression

For additional performance:
1. Enable Vercel Analytics
2. Use Vercel Edge Functions for geographically distributed serving
3. Enable Incremental Static Regeneration (ISR) for static pages

## Custom Domain

### Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

### Netlify

1. Go to "Domain settings"
2. Add custom domain
3. Update DNS records
4. Enable HTTPS (automatic)

## Monitoring

### Vercel Analytics

Enable in project settings to track:
- Page views
- Performance metrics
- Error rates
- User behavior

### Sentry (Error Tracking)

To add error tracking:

```bash
npm install @sentry/nextjs
```

Then configure in `sentry.client.config.js` and `sentry.server.config.js`.

## CI/CD

Vercel and Netlify automatically deploy on git push. For manual CI/CD:

### GitHub Actions Example

```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - run: cd frontend && npm run start
```

## Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Check [Vercel Documentation](https://vercel.com/docs)
- Review backend logs at Render.com
- Verify environment variables are set correctly

## Next Steps After Deployment

1. **Set up analytics** - Track user behavior
2. **Configure monitoring** - Set up error tracking
3. **Add custom domain** - Professional appearance
4. **Enable HTTPS** - Secure connections (automatic on Vercel/Netlify)
5. **Test thoroughly** - Verify all features work in production
6. **Share with users** - Your app is ready!

Your Picstoria frontend is now production-ready and can be deployed with a single command!
