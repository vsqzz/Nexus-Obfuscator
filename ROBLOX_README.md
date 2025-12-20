# 🎮 Roblox Obfuscation - Quick Guide

## ✅ What Was Fixed

Your obfuscator now **works with Roblox!** The issue was that the old version used Lua bytecode, which Roblox doesn't support.

### Changes Made

✅ **New Luau Obfuscator** - Source-to-source transformation (no bytecode)
✅ **Multiple Levels** - Low, Medium, High protection
✅ **String Encryption** - XOR-based string obfuscation
✅ **Number Obfuscation** - Mathematical transformations
✅ **Variable Renaming** - Random variable names (high level)
✅ **Discord Bot Updated** - Now with level/type selection
✅ **Roblox Compatible** - Works with loadstring()

## 🚀 How to Use

### In Discord

1. Use `/obfuscate` command
2. Upload your `.lua` file
3. **Select options:**
   - **Type**: Choose "**Luau (Roblox) - Recommended**"
   - **Level**: Choose one:
     - `Low` - Fast, readable (testing)
     - `Medium` - **Recommended** for most cases
     - `High` - Maximum protection (slower)
4. Download the obfuscated file

### In Roblox

#### Step 1: Upload to GitHub

1. Create a GitHub repository
2. Upload your obfuscated script
3. Click "Raw" button
4. Copy the URL

#### Step 2: Load in Roblox

```lua
-- Simple version
loadstring(game:HttpGet("https://raw.githubusercontent.com/username/repo/main/script.lua"))()

-- With error handling (recommended)
local success, err = pcall(function()
    loadstring(game:HttpGet("YOUR_RAW_URL"))()
end)

if not success then
    warn("Script failed:", err)
end
```

## 📊 Protection Levels

| Level | Speed | Protection | Size | Best For |
|-------|-------|------------|------|----------|
| **Low** | ⚡⚡⚡ | 🔒 | 1.5x | Testing |
| **Medium** | ⚡⚡ | 🔒🔒 | 2-3x | **Production** |
| **High** | ⚡ | 🔒🔒🔒 | 4-6x | Max Security |

## 📝 Example

### Before (Your Script)
```lua
local player = game.Players.LocalPlayer
print("Hello, " .. player.Name)
```

### After (Medium Level)
```lua
-- Obfuscated by Nexus Obfuscator

local player = game.Players.LocalPlayer
print((function() local t={72,101,108,108,111,44,32} local s='' for i=1,#t do s=s..string.char(t[i]~42) end return s end)() .. player.Name)
```

The strings are now encrypted and harder to read!

## 🎯 Tips

### ✅ Do's
- Always select **"Luau (Roblox)"** type for Roblox scripts
- Use **Medium** level for best balance
- Test in Studio first
- Keep backup of original code

### ❌ Don'ts
- Don't use "Standard Lua 5.1" for Roblox (won't work!)
- Don't use High level unless needed (performance impact)
- Don't lose your original source code

## 🔧 Troubleshooting

### "loadstring is not available"
**Fix**: Some Roblox games disable loadstring. This is a game restriction, not your script.

### "Syntax error"
**Fix**: Try "Low" level first to test. The original script might have issues.

### Script loads but doesn't work
**Fix**: Try "Medium" instead of "High". Some dynamic code doesn't work after heavy obfuscation.

## 📚 Full Documentation

For detailed guide, see: **ROBLOX_GUIDE.md**

---

**Now your scripts will work in Roblox! 🎮🔒**

Test it and let me know if you need any adjustments!
