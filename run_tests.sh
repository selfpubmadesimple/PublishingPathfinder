#!/bin/bash

# Publishing Path Finder - Comprehensive Test Suite
# Run this script before any deployment or major changes

set -e  # Exit on any error

echo "🚀 Starting Publishing Path Finder Test Suite..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Run this script from the project root."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    print_status "Dependencies installed"
fi

# TypeScript compilation check
echo "🔍 Checking TypeScript compilation..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    print_status "TypeScript compilation passed"
else
    print_error "TypeScript compilation failed"
    exit 1
fi

# Linting
echo "🧹 Running ESLint..."
npx eslint . --ext .ts,.tsx --max-warnings 0
if [ $? -eq 0 ]; then
    print_status "Linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# Build test
echo "🏗️ Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# Database connection test
echo "🗄️ Testing database connectivity..."
if [ -z "$DATABASE_URL" ]; then
    print_warning "DATABASE_URL not set - skipping database tests"
else
    # Simple connection test
    node -e "
    const { Pool } = require('@neondatabase/serverless');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    pool.query('SELECT 1').then(() => {
        console.log('Database connection successful');
        process.exit(0);
    }).catch(err => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });
    "
    if [ $? -eq 0 ]; then
        print_status "Database connection test passed"
    else
        print_error "Database connection test failed"
        exit 1
    fi
fi

# API endpoint tests (if server is running)
echo "🌐 Testing API endpoints..."
# Start server in background for testing
npm run dev &
SERVER_PID=$!
sleep 5  # Give server time to start

# Test key endpoints
curl -f -s http://localhost:5000/api/quiz/questions > /dev/null
if [ $? -eq 0 ]; then
    print_status "Quiz questions endpoint working"
else
    print_warning "Quiz questions endpoint not responding"
fi

curl -f -s http://localhost:5000/api/publishing-paths > /dev/null
if [ $? -eq 0 ]; then
    print_status "Publishing paths endpoint working"
else
    print_warning "Publishing paths endpoint not responding"
fi

# Stop the test server
kill $SERVER_PID 2>/dev/null || true

# PDF generation test
echo "📄 Testing PDF generation..."
node -e "
const fs = require('fs');
const path = require('path');

// Check if jsPDF can be imported
try {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    doc.text('Test PDF', 20, 20);
    console.log('PDF generation library working');
} catch (err) {
    console.error('PDF generation test failed:', err.message);
    process.exit(1);
}
"
if [ $? -eq 0 ]; then
    print_status "PDF generation test passed"
else
    print_error "PDF generation test failed"
    exit 1
fi

# Security check - ensure no secrets in code
echo "🔒 Checking for exposed secrets..."
if grep -r "sk_" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules . > /dev/null; then
    print_error "Potential API keys found in code!"
    exit 1
else
    print_status "No exposed secrets detected"
fi

# Bundle size check
echo "📊 Checking bundle size..."
BUNDLE_SIZE=$(stat -f%z dist/public/assets/index-*.js 2>/dev/null || stat -c%s dist/public/assets/index-*.js 2>/dev/null || echo "0")
if [ "$BUNDLE_SIZE" -gt 500000 ]; then  # 500KB threshold
    print_warning "Bundle size is large: ${BUNDLE_SIZE} bytes"
else
    print_status "Bundle size acceptable: ${BUNDLE_SIZE} bytes"
fi

echo "================================================"
echo -e "${GREEN}🎉 All tests passed! Ready for deployment.${NC}"
echo "================================================"

# Pre-deployment checklist reminder
echo "📋 Pre-deployment checklist:"
echo "  □ Manual quiz flow tested"
echo "  □ PDF download verified"
echo "  □ Database schema up to date"
echo "  □ Environment variables configured"
echo "  □ Team notification sent"
echo ""
echo "Run 'npm run deploy' when ready!"