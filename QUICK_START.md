# ⚡ Quick Start Guide

Get your Nexus Obfuscator up and running in 5 minutes!

## 📦 Install

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## 🔑 Configure Discord Bot

1. Go to https://discord.com/developers/applications
2. Create a new application
3. Create a bot user
4. Copy the bot token
5. Edit `.env` and paste your token:

```env
DISCORD_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

## 🚀 Run

```bash
# Start everything (bot + API)
npm start

# Or run separately
npm run bot   # Just Discord bot
npm run api   # Just API server
```

## 🎯 Use Discord Bot

1. Invite bot to your server (see SETUP_GUIDE.md)
2. Type `/obfuscate` in Discord
3. Upload your `.lua` file
4. Download obfuscated result!

## 🔌 Use API

```bash
# Get your API key from /account command in Discord

# Test the API
curl -X POST http://localhost:3000/api/obfuscate \
  -H "X-API-Key: YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"test\")"}'
```

## 📚 Full Documentation

- **README_NEW.md** - Complete feature documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_EXAMPLES.md** - Code examples in multiple languages

## ✅ Verify Installation

```bash
# Run tests
node scripts/test.js

# Check health
curl http://localhost:3000/health
```

## 🆘 Need Help?

- Check SETUP_GUIDE.md for detailed instructions
- See API_EXAMPLES.md for integration examples
- Review error messages in console output

---

**Ready to protect your Lua scripts! 🔐**
