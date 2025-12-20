# 🚀 Nexus Obfuscator - Complete Setup Guide

This guide will walk you through setting up the Nexus Obfuscator Discord bot and API.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Discord Bot Setup](#discord-bot-setup)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Service](#running-the-service)
6. [Inviting the Bot](#inviting-the-bot)
7. [Getting Your API Key](#getting-your-api-key)
8. [Testing](#testing)

## Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   ```bash
   # Check version
   node --version

   # Install from https://nodejs.org/
   ```

2. **Lua 5.1** with luac compiler
   ```bash
   # Ubuntu/Debian
   sudo apt-get install lua5.1

   # macOS
   brew install lua@5.1

   # Windows
   # Download from https://github.com/rjpcomputing/luaforwindows/releases
   ```

3. **Git** (for cloning)
   ```bash
   git --version
   ```

## Discord Bot Setup

### Step 1: Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name your application (e.g., "Nexus Obfuscator")
4. Click "Create"

### Step 2: Create Bot User

1. In your application, go to the "Bot" tab
2. Click "Add Bot"
3. Confirm by clicking "Yes, do it!"
4. **Important**: Copy your bot token (you'll need this later)
   - Click "Reset Token" if you need to see it again
   - ⚠️ Never share this token!

### Step 3: Configure Bot Permissions

1. Still in the "Bot" tab:
   - Enable "Message Content Intent" (if needed)
   - Enable "Server Members Intent" (if needed)

### Step 4: Get Application ID

1. Go to the "General Information" tab
2. Copy your "Application ID" (Client ID)

## Installation

### Step 1: Get the Code

```bash
# If you haven't already, navigate to the project
cd Nexus-Obfuscator

# Install dependencies
npm install
```

### Step 2: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

## Configuration

### Edit .env File

Open `.env` in your favorite editor and fill in the values:

```env
# Discord Bot Configuration
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
DISCORD_CLIENT_ID=YOUR_APPLICATION_ID_HERE
DISCORD_GUILD_ID=                    # Optional: for guild-specific commands

# API Configuration
API_PORT=3000
API_SECRET=change_this_to_random_string
JWT_SECRET=change_this_to_another_random_string

# Rate Limiting
FREE_TIER_RATE_LIMIT=5
PREMIUM_TIER_RATE_LIMIT=100

# Obfuscator Settings
MAX_FILE_SIZE=1048576               # 1MB in bytes
TEMP_DIR=./temp
```

### Generate Secure Secrets

For production, generate secure random strings:

```bash
# Linux/Mac
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running the Service

### Development Mode

```bash
# Run both bot and API
npm start

# Or run them separately:
npm run bot    # Just the Discord bot
npm run api    # Just the API server
```

### Production Mode

For production, use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start the service
pm2 start src/index.js --name nexus-obfuscator

# View logs
pm2 logs nexus-obfuscator

# Stop the service
pm2 stop nexus-obfuscator

# Restart the service
pm2 restart nexus-obfuscator
```

## Inviting the Bot

### Step 1: Generate Invite URL

1. Go to your Discord Application
2. Navigate to "OAuth2" → "URL Generator"
3. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
4. Select bot permissions:
   - ✅ Send Messages
   - ✅ Attach Files
   - ✅ Use Slash Commands
5. Copy the generated URL at the bottom

### Step 2: Invite to Your Server

1. Paste the URL in your browser
2. Select your server
3. Click "Authorize"
4. Complete the captcha

### Step 3: Verify Bot is Online

1. Check your Discord server
2. The bot should appear online
3. Type `/` and you should see the bot's commands

## Getting Your API Key

### For Discord Users

1. Use the `/account` command in Discord
2. If you're on the premium tier, your API key will be displayed
3. Copy and save it securely

### For Manual Setup

You can manually create a user in the code:

```javascript
// Add to src/utils/auth.js or create a setup script
const authManager = require('./src/utils/auth');

// Create a premium user
const user = authManager.createUser('your-user-id', 'premium');
console.log('Your API Key:', user.apiKey);
```

## Testing

### Test Discord Bot

1. In Discord, type `/obfuscate`
2. Attach a simple Lua file:
   ```lua
   print("Hello, World!")
   ```
3. Submit and wait for the response

### Test API

```bash
# 1. Test health endpoint
curl http://localhost:3000/health

# 2. Test validation (replace YOUR_API_KEY)
curl -X POST http://localhost:3000/api/validate \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"test\")"}'

# 3. Test obfuscation
curl -X POST http://localhost:3000/api/obfuscate \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code": "local x = 5\nprint(x)"}' | jq
```

## Verification Checklist

- [ ] Node.js and Lua installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Bot token added to `.env`
- [ ] Service starts without errors
- [ ] Bot appears online in Discord
- [ ] Slash commands visible in Discord
- [ ] `/obfuscate` command works
- [ ] API responds to health check
- [ ] API authentication works

## Common Issues

### "Cannot find module"

```bash
npm install
```

### "Invalid token" error

- Check your `DISCORD_TOKEN` in `.env`
- Make sure there are no extra spaces
- Try resetting the token in Discord Developer Portal

### Commands not showing up

```bash
# Clear node cache and restart
rm -rf node_modules package-lock.json
npm install
npm start
```

Wait a few minutes for Discord to sync commands globally.

### "luac: command not found"

Install Lua 5.1:
- Ubuntu: `sudo apt-get install lua5.1`
- macOS: `brew install lua@5.1`
- Windows: Install LuaForWindows

### API returns 401

- Verify your API key is correct
- Check that you're premium tier for API access
- Ensure `X-API-Key` header is set

## Next Steps

1. **Customize**: Modify tier limits in `src/config/index.js`
2. **Database**: Add persistent storage (MongoDB, PostgreSQL)
3. **Monitoring**: Add logging and monitoring
4. **Deployment**: Deploy to a VPS or cloud platform
5. **Domain**: Set up a custom domain for the API

## Need Help?

- Check the main README.md for detailed documentation
- Review error logs in console
- Check Discord.js documentation
- Open an issue on GitHub

---

**Congratulations! 🎉 Your Nexus Obfuscator is now set up!**
