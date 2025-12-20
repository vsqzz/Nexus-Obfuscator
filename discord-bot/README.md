# 🔒 Nexus Obfuscator Discord Bot

A powerful Discord bot for obfuscating Lua/Luau scripts, designed specifically for Roblox.

## ✨ Features

- 🔐 **XOR String Encryption** - Encrypt all strings with random keys
- 🔢 **Number Obfuscation** - Transform numbers using math operations
- 🎯 **Variable Renaming** - Confusing variable names (high level)
- 🚀 **Pure JavaScript** - No external dependencies required
- 🎮 **Roblox Compatible** - Works with `loadstring()` in Roblox
- 📊 **Multiple Protection Levels** - Low, Medium, High

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Bot

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your bot credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   ```

### 3. Get Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" section → Click "Reset Token"
4. Copy the token to `.env` as `DISCORD_TOKEN`
5. Go to "OAuth2" section → Copy "CLIENT ID" to `.env`

### 4. Invite Bot to Server

Use this URL (replace `YOUR_CLIENT_ID`):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot%20applications.commands
```

### 5. Run the Bot

```bash
npm start
```

## 📖 Commands

### `/obfuscate`
Obfuscate a Lua/Luau script file.

**Options:**
- `file` - Your `.lua` or `.luau` file
- `level` - Protection level:
  - **Low** - String encryption only (fast)
  - **Medium** - Strings + numbers (recommended) ⭐
  - **High** - Full protection + variable renaming

**Example:**
1. Type `/obfuscate`
2. Upload your script file
3. Select protection level
4. Download obfuscated file

### `/help`
Shows help and usage information.

## 🎮 Using in Roblox

### Method 1: From GitHub
```lua
loadstring(game:HttpGet("https://raw.githubusercontent.com/user/repo/main/script.lua"))()
```

### Method 2: Direct Paste
```lua
loadstring([[
  -- Paste obfuscated code here
]])()
```

## 📊 Protection Levels

| Level | Features | Size Increase | Performance | Best For |
|-------|----------|---------------|-------------|----------|
| **Low** | String encryption | ~2.5x | Fast | Testing |
| **Medium** | Strings + Numbers | ~4x | Good | Production ⭐ |
| **High** | Full protection | ~5.5x | Slower | Max Security |

## 🛠️ Development

### Run in development mode (auto-restart):
```bash
npm run dev
```

### File Structure
```
discord-bot/
├── bot.js              # Main bot file
├── obfuscator.js       # Obfuscation engine
├── commands/           # Slash commands
│   ├── obfuscate.js   # Obfuscate command
│   └── help.js        # Help command
├── package.json
├── .env.example
└── README.md
```

## ⚠️ Important Notes

- **Obfuscation ≠ Encryption**: Code can still be reverse-engineered with enough effort
- **Always test**: Test obfuscated scripts before deploying to production
- **File size limit**: Maximum 5MB per file
- **Performance**: Higher obfuscation levels may impact script performance

## 🐛 Troubleshooting

### "Invalid Token" Error
- Check your `DISCORD_TOKEN` in `.env`
- Make sure there are no spaces or quotes around the token
- Try resetting your bot token in Discord Developer Portal

### "Sessions Remaining" Error
- Your bot hit Discord's session limit
- Wait 24 hours or create a new bot token

### Commands not showing in Discord
- Make sure bot has `applications.commands` scope
- Re-invite bot with correct permissions URL
- Wait a few minutes for Discord to register commands

### Bot offline but no errors
- Check if `DISCORD_TOKEN` is correct
- Make sure bot has proper intents enabled
- Check Discord Developer Portal for bot status

## 📝 License

MIT License - feel free to use and modify!

## 🔗 Links

- [GitHub Repository](https://github.com/vsqzz/Nexus-Obfuscator)
- [Discord.js Documentation](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers/applications)

---

Made with ❤️ for the Roblox community
