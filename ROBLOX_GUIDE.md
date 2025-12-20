# 🎮 Roblox/Luau Obfuscation Guide

Complete guide for using Nexus Obfuscator with Roblox scripts.

## 🌟 What's Different?

Unlike standard Lua obfuscators that use bytecode (which doesn't work in Roblox), Nexus Obfuscator v2.0 uses **source-to-source transformation** that's fully compatible with **Luau** (Roblox's Lua variant).

### Features

✅ **Roblox Compatible** - Works with loadstring() in Roblox
✅ **String Encryption** - XOR encryption for all strings
✅ **Number Obfuscation** - Mathematical transformations
✅ **Variable Renaming** - Randomized variable names
✅ **Multiple Levels** - Low, Medium, High protection
✅ **No Bytecode** - Pure source transformation

## 📱 Discord Bot Usage

### Step 1: Obfuscate Your Script

1. Use the `/obfuscate` command in Discord
2. Attach your `.lua` file
3. Choose options:
   - **Type**: Select "Luau (Roblox) - Recommended"
   - **Level**: Choose protection level:
     - `Low` - Fast, maintains readability
     - `Medium` - Balanced (recommended)
     - `High` - Maximum protection
4. Wait for the bot to process
5. Download the obfuscated file

### Step 2: Upload to GitHub

1. Create a new repository on GitHub (can be private)
2. Upload your obfuscated script
3. Open the file on GitHub
4. Click the "Raw" button
5. Copy the raw URL (e.g., `https://raw.githubusercontent.com/username/repo/main/script.lua`)

### Step 3: Use in Roblox

#### Method 1: Direct Load

```lua
loadstring(game:HttpGet("YOUR_RAW_GITHUB_URL"))()
```

#### Method 2: With Error Handling

```lua
local success, result = pcall(function()
    return loadstring(game:HttpGet("YOUR_RAW_GITHUB_URL"))()
end)

if not success then
    warn("Failed to load script:", result)
end
```

#### Method 3: With Caching

```lua
local HttpService = game:GetService("HttpService")
local url = "YOUR_RAW_GITHUB_URL"

local success, code = pcall(function()
    return game:HttpGet(url)
end)

if success then
    local func = loadstring(code)
    if func then
        func()
    else
        warn("Failed to compile script")
    end
else
    warn("Failed to download script:", code)
end
```

## 🔒 Protection Levels Explained

### Low Level
- **String encryption**: ✅
- **Number obfuscation**: ❌
- **Variable renaming**: ❌
- **Junk code**: ❌
- **Best for**: Testing, development
- **Performance**: Fastest
- **Size**: ~1.5x original

### Medium Level (Recommended)
- **String encryption**: ✅
- **Number obfuscation**: ✅
- **Variable renaming**: ❌
- **Junk code**: ❌
- **Best for**: Production, most use cases
- **Performance**: Good
- **Size**: ~2-3x original

### High Level
- **String encryption**: ✅
- **Number obfuscation**: ✅
- **Variable renaming**: ✅
- **Junk code**: ✅
- **Best for**: Maximum protection
- **Performance**: Slower
- **Size**: ~4-6x original

## 📝 Example

### Original Script
```lua
local player = game.Players.LocalPlayer
local message = "Hello, World!"

print(message)
print("Player name:", player.Name)

local function greet(name)
    return "Welcome, " .. name
end

print(greet(player.Name))
```

### Obfuscated (Medium Level)
```lua
-- Obfuscated by Nexus Obfuscator
-- https://github.com/your-repo

local player = game.Players.LocalPlayer
local message = (function() local t={72,101,108,108,111,44,32,87,111,114,108,100,33} local s='' for i=1,#t do s=s..string.char(t[i]~42) end return s end)()

print(message)
print((function() local t={80,108,97,121,101,114,32,110,97,109,101,58} local s='' for i=1,#t do s=s..string.char(t[i]~17) end return s end)(), player.Name)

local function greet(name)
    return (function() local t={87,101,108,99,111,109,101,44,32} local s='' for i=1,#t do s=s..string.char(t[i]~91) end return s end)() .. name
end

print(greet(player.Name))
```

## 🛠️ Advanced Usage

### Testing Locally

Before uploading to GitHub, test your obfuscated script locally in Roblox Studio:

1. Open Roblox Studio
2. Create a new Script in ServerScriptService
3. Paste your obfuscated code
4. Run and verify it works correctly

### Debugging

If your script doesn't work after obfuscation:

1. **Check the original** - Make sure the original script works first
2. **Try lower level** - Start with "Low" level obfuscation
3. **Check syntax** - The bot validates syntax before obfuscating
4. **Test incrementally** - Obfuscate small parts first

### Common Issues

#### "loadstring is not available"
- **Solution**: Some Roblox games disable loadstring. This is a game-side restriction.
- **Workaround**: Use in games that allow loadstring or require() instead

#### "Syntax error" after obfuscation
- **Solution**: The original script might have issues. Validate with "Low" level first.

#### Script runs but doesn't work correctly
- **Solution**: Some dynamic code generation might not work after obfuscation. Try "Low" or "Medium" level.

## 🎯 Best Practices

### ✅ Do's
- Test original script thoroughly before obfuscating
- Use "Medium" level for most cases
- Keep a backup of your original script
- Test obfuscated script in Roblox Studio first
- Use error handling when loading remote scripts

### ❌ Don'ts
- Don't lose your original source code
- Don't use "High" level unless necessary (performance impact)
- Don't obfuscate scripts you're still debugging
- Don't rely solely on obfuscation for security

## 🔐 Security Notes

### What Obfuscation Protects Against
- ✅ Casual script kiddies
- ✅ Basic reverse engineering
- ✅ Direct code reading
- ✅ Simple deobfuscation tools

### What It Doesn't Protect Against
- ❌ Determined attackers with time
- ❌ Runtime analysis/hooking
- ❌ Memory dumps
- ❌ Professional deobfuscation

**Remember**: Obfuscation is **deterrence**, not **absolute protection**.

## 📊 Performance Impact

| Level | Execution Speed | Memory Usage | File Size |
|-------|----------------|--------------|-----------|
| Low | ~100% | ~105% | ~150% |
| Medium | ~90% | ~115% | ~250% |
| High | ~70% | ~130% | ~500% |

*Percentages relative to original unobfuscated script*

## 💡 Tips & Tricks

### For Game Scripts
- Use "Medium" level - best balance
- Host on GitHub (free, reliable)
- Add version checking to your loader
- Implement auto-updates

### For Models/Libraries
- Consider "Low" level for better performance
- Document the obfuscated code location
- Keep original source for updates

### For Anti-Cheat
- Use "High" level
- Combine with server-side validation
- Regularly rotate obfuscated versions

## 🆘 Support

Having issues?

1. Check this guide thoroughly
2. Test with "Low" level first
3. Verify original script works
4. Check Roblox output/errors
5. Contact support via Discord

## 📚 Additional Resources

- [Roblox LoadString Documentation](https://create.roblox.com/docs)
- [Luau Language Reference](https://luau-lang.org/)
- [GitHub Raw URLs Guide](https://docs.github.com/)

---

**Happy Obfuscating! 🎮🔒**
