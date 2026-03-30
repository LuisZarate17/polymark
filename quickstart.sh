#!/usr/bin/env bash
# Quick start script for Polymarket trading dashboard

set -e

echo "🚀 Polymarket Trading Dashboard - Quick Start"
echo "=============================================="
echo ""

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo "✓ npm $(npm --version) found"
echo ""

# Setup environment
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local and add your Polymarket API credentials"
    echo "   - POLYMARKET_API_KEY"
    echo "   - POLYMARKET_PRIVATE_KEY"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install > /dev/null 2>&1
echo "✓ Dependencies installed"
echo ""

# Run tests
echo "🧪 Running backend tests..."
if npm run test:backend 2>/dev/null | grep -q "26 passed"; then
    echo "✓ All 26 tests passing!"
else
    echo "⚠️  Some tests may have failed. Check output above."
fi
echo ""

# Build backend
echo "🏗️  Building backend..."
npm run build:backend > /dev/null 2>&1
echo "✓ Backend compiled successfully"
echo ""

# All done
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with Polymarket credentials"
echo "  2. Start development: npm run dev"
echo "  3. Open dashboard: http://localhost:3000"
echo "  4. API docs: http://localhost:3001/api/status"
echo ""
echo "Commands:"
echo "  npm run dev              - Start both servers"
echo "  npm run test:backend     - Run all tests"
echo "  npm run test:coverage    - Coverage report"
echo "  npm run build            - Build for production"
echo ""
