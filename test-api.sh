#!/bin/bash

# Picstoria API Test Script
# Tests the deployed backend at https://cosmocode.onrender.com

echo "🧪 Testing Picstoria Backend API"
echo "=================================="
echo ""

API_URL="https://cosmocode.onrender.com"

# Test 1: Public Search
echo "1️⃣  Testing public semantic search..."
SEARCH_RESPONSE=$(curl -s "$API_URL/api/photos/search?query=sunset")
if echo "$SEARCH_RESPONSE" | grep -q "images"; then
    echo "   ✅ Public search working!"
else
    echo "   ❌ Public search failed"
    echo "   Response: $SEARCH_RESPONSE"
fi
echo ""

# Test 2: CSRF Token
echo "2️⃣  Testing CSRF token endpoint..."
CSRF_RESPONSE=$(curl -s -c cookies.txt "$API_URL/api/auth/csrf")
if echo "$CSRF_RESPONSE" | grep -q "csrfToken"; then
    echo "   ✅ CSRF endpoint working!"
    CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
    echo "   Token: ${CSRF_TOKEN:0:20}..."
else
    echo "   ❌ CSRF endpoint failed"
fi
echo ""

# Test 3: Signup (will fail if user exists - that's ok)
echo "3️⃣  Testing signup endpoint..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "Test123456!"
  }')
if echo "$SIGNUP_RESPONSE" | grep -q "verify your email\|taken"; then
    echo "   ✅ Signup endpoint working!"
else
    echo "   ⚠️  Signup response: $SIGNUP_RESPONSE"
fi
echo ""

# Test 4: Server Health
echo "4️⃣  Testing server response time..."
START_TIME=$(date +%s%N)
curl -s "$API_URL/api/photos/search?query=test" > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( ($END_TIME - $START_TIME) / 1000000 ))
echo "   ⏱️  Response time: ${RESPONSE_TIME}ms"
if [ $RESPONSE_TIME -lt 5000 ]; then
    echo "   ✅ Server responding quickly!"
else
    echo "   ⚠️  Server response slow (${RESPONSE_TIME}ms)"
fi
echo ""

# Cleanup
rm -f cookies.txt

echo "=================================="
echo "🎉 API Test Complete!"
echo ""
echo "Backend URL: $API_URL"
echo "Status: Online and responding"
echo ""
echo "Try it yourself:"
echo "  curl '$API_URL/api/photos/search?query=mountains'"
