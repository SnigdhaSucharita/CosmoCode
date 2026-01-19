# Picstoria Frontend Setup Guide

## Overview
A production-ready Next.js 14 frontend with TypeScript, SSR, and cookie-based authentication has been designed for the Picstoria photo curation platform.

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query
- **Animations**: Framer Motion
- **Image Grid**: react-masonry-css

### Key Features Implemented

#### 1. Authentication System
- Login page (`/login`)
- Signup page (`/signup`)
- Forgot password page (`/forgot-password`)
- Reset password page (`/reset-password`)
- Cookie-based auth with JWT tokens
- CSRF protection on all mutations

#### 2. Public Pages
- **Homepage** (`/`)
  - Marketing content
  - Public semantic search
  - Feature highlights
  - Clean, editorial design

#### 3. Protected Pages
- **Collection** (`/collection`)
  - Masonry grid layout
  - Tag-based filtering
  - Click to view photo details

- **Photo Detail** (`/photo/[id]`)
  - Large image display
  - Color palette with copy-to-clipboard
  - AI-suggested tags (one-click add)
  - Custom tag input
  - Horizontal scrolling recommended images
  - Save recommended images

- **Search History** (`/history`)
  - Chronological list
  - Re-execute past searches
  - Timestamps

### Design System

#### Colors
- Neutral, editorial aesthetic
- No purple/indigo (unless requested)
- Muted accents
- Full dark mode support

#### Typography
- Inter font family
- Clear hierarchy
- Readable body text (150% line-height)
- Tight heading spacing (120%)

#### Components
- Masonry grid with responsive breakpoints
- Image cards with hover effects
- Skeleton loaders
- Toast notifications
- Color palette swatches
- Tag pills (differentiated AI vs custom)

### File Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── collection/page.tsx     # Saved photos
│   ├── photo/[id]/page.tsx     # Photo detail
│   └── history/page.tsx        # Search history
├── components/
│   ├── ui/                     # shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── use-toast.ts
│   ├── header.tsx              # Navigation header
│   ├── providers.tsx           # React Query & Theme
│   ├── theme-toggle.tsx        # Dark mode toggle
│   ├── search-section.tsx      # Public search
│   ├── masonry-grid.tsx        # Grid layout
│   ├── image-card.tsx          # Photo card
│   ├── color-palette.tsx       # Color swatches
│   ├── skeleton-grid.tsx       # Loading state
│   ├── photo-detail.tsx        # Detail view
│   ├── collection-grid.tsx     # Collection view
│   └── search-history-list.tsx # History view
├── lib/
│   ├── utils.ts                # cn() utility
│   ├── api-client.ts           # API wrapper
│   └── auth.ts                 # Auth helpers
├── next.config.js              # Next.js config (API proxy)
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

### API Integration

All API calls use the `ApiClient` utility which:
- Handles cookies automatically
- Manages CSRF tokens
- Provides type-safe responses
- Proxies through Next.js rewrites to avoid CORS

Example:
```typescript
// Get photos
const photos = await ApiClient.get<{ photos: Photo[] }>('/api/photos');

// Save photo (with CSRF)
const csrfToken = await ApiClient.getCsrfToken();
await ApiClient.post('/api/photos', photoData, csrfToken);
```

### Environment Variables

`.env.local`:
```
NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com
```

For local development, use:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Installation

```bash
cd frontend
npm install
npm run dev      # Development
npm run build    # Production build
npm start        # Production server
```

### Key UX Features

1. **Image-First Design**
   - Masonry layout prevents cropping
   - Lazy loading with blur-up effect
   - Smooth hover animations (scale 1.02)

2. **Smart Tag Management**
   - AI suggestions visually distinct
   - One-click to add suggested tags
   - Manual tag input with validation
   - Animated add/remove

3. **Color Palette**
   - Rounded swatches
   - Hover shows hex code
   - Click to copy with toast feedback

4. **Responsive Design**
   - Mobile-first approach
   - 1/2/3/4 column breakpoints
   - Touch-friendly interactions

5. **Loading States**
   - Skeleton screens
   - Shimmer effects
   - No layout shifts

6. **Dark Mode**
   - System preference detection
   - Manual toggle
   - Proper image contrast

### Backend Integration Points

#### Public Endpoints
- `GET /api/photos/search?query={query}` - Semantic search

#### Protected Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/signup` - Register
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Reset with token
- `POST /api/photos` - Save photo
- `GET /api/photos/:id` - Photo detail + recommendations
- `POST /api/photos/:id/tags` - Add tags
- `GET /api/photos?userId={id}` - Get all photos
- `GET /api/photos/tag/search?tag={tag}` - Search by tag
- `GET /api/search-history?userId={id}` - Get history

### Performance Optimizations

1. **SSR** - Fast initial page loads
2. **Image Optimization** - Next.js Image component
3. **Code Splitting** - Automatic route-based splitting
4. **TanStack Query** - Smart caching & refetching
5. **Parallel Data Fetching** - Server components

### Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

### Security

- HTTP-only cookies
- CSRF tokens
- XSS prevention
- No client-side secrets
- Secure password inputs

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

Set environment variable:
- `NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Testing Checklist

- [ ] Auth flow (signup → verify → login → logout)
- [ ] Public search works
- [ ] Save image to collection
- [ ] View photo detail page
- [ ] Add AI-suggested tags
- [ ] Add custom tags
- [ ] Color palette copy works
- [ ] Recommended images display
- [ ] Save recommended image
- [ ] Tag-based search in collection
- [ ] Search history displays
- [ ] Dark mode toggle
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Error handling

## Next Steps

1. Install dependencies: `npm install`
2. Set environment variables
3. Run development server: `npm run dev`
4. Test with deployed backend
5. Deploy to Vercel

## Support

For issues or questions:
- Check README.md in root
- Review API documentation
- Verify environment variables
- Check browser console for errors
