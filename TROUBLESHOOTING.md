# 🔧 Troubleshooting Discord Rate Limit

## Error: "Not enough sessions remaining"

This error occurs when your Discord bot token has been used too many times to connect to Discord's gateway.

### Why This Happens

Discord limits bot tokens to **1000 session starts per 24 hours**. Each time your bot starts, it uses one session. If you restart your bot too many times (testing, crashes, etc.), you'll hit this limit.

### Solutions

#### Option 1: Wait (Easiest)

The rate limit resets after 24 hours from your first connection. Check the error message for the reset time:

```
resets at 2025-12-21T09:41:50.918Z
```

Just wait until that time passes.

#### Option 2: Reset Your Bot Token (Recommended)

1. Go to https://discord.com/developers/applications
2. Select your application
3. Go to **Bot** tab
4. Click **Reset Token**
5. Copy the new token
6. Update your `.env` file:
   ```env
   DISCORD_TOKEN=your_new_token_here
   ```
7. Restart your bot

⚠️ **Important**: After resetting, your old token will stop working immediately!

#### Option 3: Create a New Bot

If you don't mind starting fresh:

1. Go to https://discord.com/developers/applications
2. Click **New Application**
3. Name it (e.g., "Nexus Obfuscator Bot")
4. Go to **Bot** tab
5. Click **Add Bot**
6. Copy the token
7. Update `.env` with the new token
8. Re-invite the bot to your server using the OAuth2 URL Generator

### Prevention Tips

1. **Don't restart too often** - Each restart counts toward the limit
2. **Use nodemon carefully** - It restarts on every file change
3. **Test locally first** - Make sure your code works before deploying
4. **Handle errors gracefully** - Prevent crash loops
5. **Use environment variables** - Don't commit tokens to git

### Quick Check

See how many sessions you have left:

```javascript
// The error message tells you:
// "only 0 remaining; resets at [DATE]"
```

### Development Mode

For development, consider:

1. **Use API mode only** for testing:
   ```bash
   npm run api
   ```

2. **Mock the Discord client** during testing

3. **Use a separate development bot** with its own token

### Getting Help

If you still have issues:

1. Check Discord's status: https://discordstatus.com/
2. Verify your token is valid
3. Ensure your bot has proper permissions
4. Check the Discord.js documentation: https://discord.js.org/

---

**Need immediate access?** Reset your token (Option 2) - takes less than 2 minutes!
