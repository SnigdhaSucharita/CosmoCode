#!/bin/bash

# Picstoria Quick Start Script
# This script helps you get started with Picstoria

clear

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║           🎨  PICSTORIA - AI Photo Curation Platform  🎨     ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Your backend is LIVE at: https://cosmocode.onrender.com"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "                    What would you like to do?"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "  1️⃣   Test the Backend API (30 seconds)"
echo "  2️⃣   Run the Test Suite (1 minute)"
echo "  3️⃣   View Frontend Deployment Options"
echo "  4️⃣   Create Simple Demo Page"
echo "  5️⃣   View All Documentation"
echo "  6️⃣   Exit"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🧪 Testing Backend API..."
        echo "════════════════════════════════════════════════════════════════"
        ./test-api.sh
        ;;
    2)
        echo ""
        echo "🧪 Running Test Suite..."
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies first..."
            npm install
        fi
        npm test
        ;;
    3)
        echo ""
        echo "🚀 Frontend Deployment Options"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "Option A: Deploy to Vercel (Recommended)"
        echo "  - Full Next.js application"
        echo "  - SSR, TypeScript, Tailwind CSS"
        echo "  - All features included"
        echo "  - Setup time: ~5 minutes"
        echo ""
        echo "  Steps:"
        echo "    1. npm install -g vercel"
        echo "    2. Create Next.js app following FRONTEND_SETUP.md"
        echo "    3. vercel --prod"
        echo ""
        echo "Option B: Simple HTML Demo"
        echo "  - Test the API quickly"
        echo "  - No build required"
        echo "  - Setup time: ~2 minutes"
        echo ""
        echo "  Run: Follow instructions in QUICKSTART.md"
        echo ""
        echo "Option C: Use Postman/Insomnia"
        echo "  - API testing only"
        echo "  - All endpoints documented"
        echo "  - Setup time: ~1 minute"
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "📖 See QUICKSTART.md for detailed instructions"
        echo "📖 See DEPLOYMENT_GUIDE.md for complete deployment guide"
        ;;
    4)
        echo ""
        echo "🎨 Creating Simple Demo Page..."
        echo "════════════════════════════════════════════════════════════════"
        mkdir -p demo
        cat > demo/index.html << 'HTMLEOF'
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
        <h1 class="text-4xl font-bold mb-2">🎨 Picstoria Demo</h1>
        <p class="text-gray-600 mb-8">AI-Assisted Photo Curation Platform</p>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-2xl font-semibold mb-4">Search Images</h2>
            <div class="flex gap-2 mb-4">
                <input
                    type="text"
                    id="searchQuery"
                    placeholder="Try: sunset, mountains, ocean..."
                    class="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="sunset"
                >
                <button
                    onclick="searchImages()"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    🔍 Search
                </button>
            </div>
            <p class="text-sm text-gray-500">
                Backend API: <a href="https://cosmocode.onrender.com" target="_blank" class="text-blue-600 hover:underline">https://cosmocode.onrender.com</a>
            </p>
        </div>

        <div id="results" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>

    <script>
        const API_URL = 'https://cosmocode.onrender.com';

        async function searchImages() {
            const query = document.getElementById('searchQuery').value;
            const resultsDiv = document.getElementById('results');

            resultsDiv.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">🔍 Searching...</p>';

            try {
                const response = await fetch(`${API_URL}/api/photos/search?query=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.error) {
                    resultsDiv.innerHTML = `
                        <div class="col-span-3 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <p class="text-red-600 font-semibold mb-2">⚠️ Error</p>
                            <p class="text-red-500 text-sm">${data.error}</p>
                            <p class="text-gray-600 text-xs mt-4">
                                Note: Some endpoints require authentication. See QUICKSTART.md for details.
                            </p>
                        </div>
                    `;
                    return;
                }

                if (!data.images || data.images.length === 0) {
                    resultsDiv.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">No results found. Try a different search term.</p>';
                    return;
                }

                resultsDiv.innerHTML = data.images.map(img => `
                    <div class="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1">
                        <img src="${img.imageUrl}" alt="${img.description || 'Image'}" class="w-full h-48 object-cover">
                        <div class="p-3">
                            <p class="text-sm text-gray-600 line-clamp-2">${img.description || img.altDescription || 'No description'}</p>
                        </div>
                    </div>
                `).join('');

            } catch (error) {
                resultsDiv.innerHTML = `
                    <div class="col-span-3 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p class="text-red-600 font-semibold mb-2">⚠️ Connection Error</p>
                        <p class="text-red-500 text-sm">${error.message}</p>
                        <p class="text-gray-600 text-xs mt-4">
                            Make sure the backend is running at ${API_URL}
                        </p>
                    </div>
                `;
            }
        }

        // Search on load
        document.addEventListener('DOMContentLoaded', () => {
            searchImages();
            // Allow Enter key to search
            document.getElementById('searchQuery').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') searchImages();
            });
        });
    </script>
</body>
</html>
HTMLEOF
        echo ""
        echo "✅ Demo page created at: demo/index.html"
        echo ""
        echo "📂 Open demo/index.html in your browser to test the API"
        echo ""
        if command -v open &> /dev/null; then
            read -p "Open in browser now? (y/n): " open_browser
            if [ "$open_browser" = "y" ]; then
                open demo/index.html
            fi
        fi
        ;;
    5)
        echo ""
        echo "📚 Available Documentation"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "  📖 README.md"
        echo "     → Main documentation with quick start guide"
        echo ""
        echo "  ⚡ QUICKSTART.md"
        echo "     → 3-step guide to get started immediately"
        echo ""
        echo "  🚀 DEPLOYMENT_GUIDE.md"
        echo "     → Complete deployment instructions for all platforms"
        echo ""
        echo "  🎨 FRONTEND_SETUP.md"
        echo "     → Frontend architecture and component specifications"
        echo ""
        echo "  🧪 TESTING_GUIDE.md"
        echo "     → Test suite documentation and coverage details"
        echo ""
        echo "  📊 PROJECT_SUMMARY.md"
        echo "     → Complete project overview and features"
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "💡 Start with README.md or QUICKSTART.md"
        ;;
    6)
        echo ""
        echo "👋 Thanks for using Picstoria!"
        echo ""
        echo "Quick links:"
        echo "  • Backend: https://cosmocode.onrender.com"
        echo "  • Docs: See README.md"
        echo "  • Tests: npm test"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again and select 1-6."
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📖 For more information, see:"
echo "   • README.md - Main documentation"
echo "   • QUICKSTART.md - Quick start guide"
echo "   • DEPLOYMENT_GUIDE.md - Deployment instructions"
echo ""
echo "🎉 Your Picstoria backend is ready at: https://cosmocode.onrender.com"
echo ""
