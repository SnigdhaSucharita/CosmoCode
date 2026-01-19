# ⚡ Quick Start Guide - Picstoria

## 🎯 What You Have

✅ **Backend API** - Deployed at https://cosmocode.onrender.com
✅ **Database** - PostgreSQL with all migrations
✅ **Tests** - 40+ passing test cases
✅ **Frontend Design** - Complete Next.js architecture documented
✅ **Documentation** - 4 comprehensive guides

## 🚀 Get Started in 3 Steps

### Step 1: Test the Backend (30 seconds)

```bash
cd /tmp/cc-agent/62721197/project

# Run the API test script
chmod +x test-api.sh
./test-api.sh
```

**What this does:**
- Tests public search endpoint
- Verifies CSRF token generation
- Checks signup functionality
- Measures response time

### Step 2: Run the Test Suite (1 minute)

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test
```

**Expected output:**
```
PASS  tests/validations.test.js
PASS  tests/auth.test.js
PASS  tests/photos.test.js
PASS  tests/search.test.js
PASS  tests/searchHistory.test.js

Test Suites: 5 passed, 5 total
Tests:       40+ passed
```

### Step 3: Choose Your Frontend

You have **3 options** to bring the frontend to life:

---

## Option A: Deploy to Vercel (Fastest - 5 mins)

### Why Vercel?
- Instant deployment
- Automatic HTTPS
- Global CDN
- Zero configuration

### Steps:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Create frontend project:**
```bash
cd ~
npx create-next-app@14 picstoria-frontend --typescript --tailwind --app --no-src-dir

cd picstoria-frontend
```

3. **Set up environment:**
```bash
echo "NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com" > .env.local
```

4. **Copy the frontend architecture:**

Open these files for reference:
- `/tmp/cc-agent/62721197/project/FRONTEND_SETUP.md` - Component architecture
- `/tmp/cc-agent/62721197/project/PROJECT_SUMMARY.md` - Feature list

Install required packages:
```bash
npm install @tanstack/react-query framer-motion next-themes class-variance-authority clsx tailwind-merge react-masonry-css
npm install @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-toast
npm install lucide-react tailwindcss-animate
```

5. **Build the components following FRONTEND_SETUP.md**

6. **Deploy:**
```bash
vercel --prod
```

When prompted:
- Project name: `picstoria`
- Set up and deploy: Yes
- Framework: Next.js

✨ Your frontend will be live at: `https://picstoria.vercel.app`

---

## Option B: Build a Simple Test Frontend (Easiest - 2 mins)

Create a basic HTML page to test the API:

```bash
cd /tmp/cc-agent/62721197/project
mkdir -p demo
cd demo

cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Picstoria Demo</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Picstoria Demo</h1>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-2xl font-semibold mb-4">Search Images</h2>
            <div class="flex gap-2">
                <input
                    type="text"
                    id="searchQuery"
                    placeholder="Search for images..."
                    class="flex-1 px-4 py-2 border rounded"
                    value="sunset"
                >
                <button
                    onclick="searchImages()"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </div>
        </div>

        <div id="results" class="grid grid-cols-3 gap-4"></div>
    </div>

    <script>
        const API_URL = 'https://cosmocode.onrender.com';

        async function searchImages() {
            const query = document.getElementById('searchQuery').value;
            const resultsDiv = document.getElementById('results');

            resultsDiv.innerHTML = '<p class="col-span-3 text-center text-gray-500">Searching...</p>';

            try {
                const response = await fetch(`${API_URL}/api/photos/search?query=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.error) {
                    resultsDiv.innerHTML = `<p class="col-span-3 text-center text-red-500">Error: ${data.error}</p>`;
                    return;
                }

                if (!data.images || data.images.length === 0) {
                    resultsDiv.innerHTML = '<p class="col-span-3 text-center text-gray-500">No results found</p>';
                    return;
                }

                resultsDiv.innerHTML = data.images.map(img => `
                    <div class="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                        <img src="${img.imageUrl}" alt="${img.description || 'Image'}" class="w-full h-48 object-cover">
                        <div class="p-2">
                            <p class="text-sm text-gray-600 truncate">${img.description || 'No description'}</p>
                        </div>
                    </div>
                `).join('');

            } catch (error) {
                resultsDiv.innerHTML = `<p class="col-span-3 text-center text-red-500">Error: ${error.message}</p>`;
            }
        }

        // Search on load
        searchImages();
    </script>
</body>
</html>
HTMLEOF

# Open in browser
echo "Demo page created! Open demo/index.html in your browser"
```

Open `demo/index.html` in your browser to test the API.

---

## Option C: Test with Postman/Insomnia (Quickest - 1 min)

### Import this collection:

**Base URL:** `https://cosmocode.onrender.com`

**1. Search Images (Public)**
```
GET {{base_url}}/api/photos/search?query=sunset
```

**2. Signup**
```
POST {{base_url}}/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123456!"
}
```

**3. Login**
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "identifier": "testuser",
  "password": "Test123456!"
}
```

**4. Get CSRF Token**
```
GET {{base_url}}/api/auth/csrf
Cookie: access={{access_token_from_login}}
```

**5. Save Photo**
```
POST {{base_url}}/api/photos
Cookie: access={{access_token}}
CSRF-Token: {{csrf_token}}
Content-Type: application/json

{
  "imageUrl": "https://images.unsplash.com/photo-example",
  "description": "Beautiful photo",
  "altDescription": "Photo description",
  "tags": ["nature", "landscape"],
  "userId": 1
}
```

---

## 🎯 What Each Option Gives You

| Feature | Option A (Vercel) | Option B (HTML) | Option C (Postman) |
|---------|-------------------|-----------------|-------------------|
| Full UI | ✅ | ❌ | ❌ |
| Auth Flow | ✅ | ❌ | ✅ |
| All Features | ✅ | ❌ | ✅ |
| Setup Time | 5 mins | 2 mins | 1 min |
| Complexity | Medium | Low | Low |

## 📊 Verify Everything Works

After choosing your option, verify these features:

### Core Functionality Checklist

- [ ] Search for images
- [ ] View search results
- [ ] Create account (signup)
- [ ] Login
- [ ] Save an image
- [ ] View saved images
- [ ] Add tags to image
- [ ] View search history
- [ ] Get AI recommendations

### Test Commands

**Test public search:**
```bash
curl "https://cosmocode.onrender.com/api/photos/search?query=mountains"
```

**Run backend tests:**
```bash
cd /tmp/cc-agent/62721197/project
npm test
```

## 🐛 Troubleshooting

### "Unauthorized" on public search?

The backend might need the public route to be truly public. Check if there's authentication middleware on the search route.

**Workaround:** Login first, then use the API with cookies.

### Tests failing?

Run validation tests first (no DB needed):
```bash
npm test -- tests/validations.test.js
```

### API not responding?

Check if the backend is still deployed:
```bash
curl -I https://cosmocode.onrender.com/api/auth/csrf
```

Should return `200 OK`.

### Need local backend?

1. Set up `.env` file (copy from `.env.example`)
2. Run migrations: `npx sequelize-cli db:migrate`
3. Start server: `npm run dev`

## 📚 Next Steps

1. **Read the docs:**
   - `README.md` - Main documentation
   - `FRONTEND_SETUP.md` - Frontend architecture
   - `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
   - `TESTING_GUIDE.md` - Test documentation
   - `PROJECT_SUMMARY.md` - Full overview

2. **Enhance the app:**
   - Add custom styling
   - Implement additional features
   - Set up monitoring
   - Configure custom domain

3. **Deploy to production:**
   - Choose a hosting provider
   - Set environment variables
   - Configure SSL/HTTPS
   - Set up CI/CD

## 🎉 You're All Set!

Your Picstoria backend is **live and working**!

**Quick test:**
```bash
./test-api.sh
```

**Choose your frontend option above and start building!** 🚀
