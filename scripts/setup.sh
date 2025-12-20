#!/bin/bash

echo "=================================="
echo "  Nexus Obfuscator Setup Script"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js v16 or higher from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check Lua
if ! command -v lua &> /dev/null; then
    echo "❌ Lua is not installed"
    echo "   Please install Lua 5.1"
    exit 1
fi

echo "✅ Lua $(lua -v 2>&1 | head -n1) found"

# Check luac
if ! command -v luac &> /dev/null; then
    echo "❌ luac compiler is not installed"
    echo "   Please install Lua development tools"
    exit 1
fi

echo "✅ luac compiler found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and add your Discord bot token and other configuration"
else
    echo ""
    echo "ℹ️  .env file already exists"
fi

# Create temp directory
echo ""
echo "📁 Creating temp directory..."
mkdir -p temp
echo "✅ Temp directory created"

echo ""
echo "=================================="
echo "  Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Add your Discord bot token"
echo "3. Run: npm start"
echo ""
echo "For detailed instructions, see SETUP_GUIDE.md"
