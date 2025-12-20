#!/bin/bash

# Setup script for Nexus Obfuscator Discord Bot

echo "========================================="
echo "  Nexus Obfuscator Setup"
echo "========================================="
echo

# Check if Prometheus is already cloned
if [ ! -d "prometheus-obfuscator" ]; then
  echo "📥 Cloning Prometheus obfuscator..."
  git clone https://github.com/prometheus-lua/Prometheus.git prometheus-obfuscator
  echo "✅ Prometheus cloned successfully!"
else
  echo "✅ Prometheus already exists"
fi

echo
echo "📦 Installing npm dependencies..."
npm install

echo
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo
echo "⚠️  IMPORTANT: You need Lua installed!"
echo "  Download: https://sourceforge.net/projects/luabinaries/"
echo
echo "Next steps:"
echo "  1. Copy .env.example to .env"
echo "  2. Add your Discord bot token to .env"
echo "  3. Run: npm start"
echo
