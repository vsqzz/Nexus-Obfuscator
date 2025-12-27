# Development Guide

## Auto-Restart Setup

The bot now supports automatic restarting when you make changes to the code!

### How to Use

Instead of `npm start`, use:

```bash
npm run dev
```

### What Gets Watched

Nodemon will automatically restart the bot when you modify:
- `bot.js` - Main bot file
- `obfuscator.js` - Obfuscator wrapper
- `commands/**/*.js` - Any command files
- `.env` - Environment variables

### Ignored Files

These won't trigger restarts:
- `temp/**` - Temporary obfuscation files
- `node_modules/**` - Dependencies
- `*.log` - Log files

### How It Works

1. **Make changes** to any watched file
2. **Save the file**
3. **Wait 1 second** (delay to batch multiple changes)
4. **Bot automatically restarts** with your new code!

**No need to:**
- ❌ Stop the bot manually
- ❌ Refresh Discord
- ❌ Re-run commands
- ❌ Wait for Discord cache to clear

### Features

✅ **Graceful Shutdown**: Properly disconnects from Discord before restarting
✅ **Cache Clearing**: Clears command cache for true hot reload
✅ **Fast Reload**: 1-second delay between file change and restart
✅ **Smart Watching**: Only watches relevant files, ignores temp files

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start bot with auto-restart |
| `npm run dev:verbose` | Start with detailed logging |
| `npm start` | Start bot normally (no auto-restart) |

### Example Workflow

```bash
# Terminal 1: Start dev server
cd discord-bot
npm run dev

# Terminal 2: Make changes
# Edit commands/obfuscate.js
# Save file
# Watch Terminal 1 - bot automatically restarts!
```

### Output

When you save a file, you'll see:

```
🔄 Restarting bot...

🛑 Received SIGUSR2 - Shutting down gracefully...
✅ Discord client disconnected
✅ Command cache cleared for reload
👋 Shutdown complete

[nodemon] restarting due to changes...
[nodemon] starting `node bot.js`

═══════════════════════════════════════
  🔒 Nexus Obfuscator Bot v2.0
  Discord Bot for Lua/Luau Obfuscation
═══════════════════════════════════════

📂 Loading commands...
  ✅ Loaded: help
  ✅ Loaded: obfuscate
...
```

### Troubleshooting

**Bot doesn't restart?**
- Make sure you're using `npm run dev`, not `npm start`
- Check nodemon is installed: `npm install`
- Try verbose mode: `npm run dev:verbose`

**Discord shows "Bot is offline" during restart?**
- This is normal! The bot reconnects within 1-2 seconds
- Users don't need to refresh Discord

**Changes not taking effect?**
- Check you saved the file
- Make sure the file is in a watched directory
- Try stopping and restarting `npm run dev`

### Advanced Configuration

Edit `nodemon.json` to customize:

```json
{
  "watch": ["bot.js", "obfuscator.js", "commands/**/*.js", ".env"],
  "ignore": ["temp/**", "node_modules/**"],
  "delay": 1000,  // Change delay (milliseconds)
  "ext": "js,json,env"  // File extensions to watch
}
```

### Production

For production, always use:

```bash
npm start
```

This runs the bot without auto-restart for stability.

### Tips

💡 **Keep dev terminal visible** so you can see when the bot restarts
💡 **Use two terminals** - one for the bot, one for editing
💡 **Test changes immediately** - just save and the bot reloads!
💡 **Watch for errors** - nodemon will show them during startup

Happy developing! 🚀
