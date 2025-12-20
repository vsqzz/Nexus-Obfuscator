# 🔐 Nexus Obfuscator v2.0

Advanced Lua obfuscation service with Discord bot and REST API support.

## 🌟 Features

- **Advanced Obfuscation**: Bytecode compilation, variable randomization, VM wrapping
- **Discord Bot**: Easy-to-use slash commands for obfuscating scripts
- **REST API**: Premium API access for integration into your tools
- **Tier System**: Free and Premium tiers with different limits
- **Rate Limiting**: Built-in rate limiting and usage tracking
- **Validation**: Automatic Lua syntax validation before obfuscation

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Lua 5.1 with `luac` compiler
- Discord bot token (for bot mode)

### Installation

```bash
# Clone the repository
cd Nexus-Obfuscator

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Configuration

Edit `.env` file:

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id (optional)

# API
API_PORT=3000
JWT_SECRET=your_secret_here

# Rate Limits
FREE_TIER_RATE_LIMIT=5
PREMIUM_TIER_RATE_LIMIT=100
```

### Running the Service

```bash
# Run both bot and API
npm start

# Run only the Discord bot
npm run bot

# Run only the API
npm run api

# Development mode with auto-reload
npm run dev
```

## 🤖 Discord Bot Usage

### Commands

- `/obfuscate` - Obfuscate a Lua file
  - Attach your `.lua` file
  - Receive obfuscated output

- `/account` - View your account information
  - Shows tier, usage, limits
  - Displays API key (premium only)

- `/help` - Show help information

- `/premium` - View premium tier details

### Example

1. Type `/obfuscate` in Discord
2. Click the "file" option and upload your `.lua` script
3. Press Enter
4. Download the obfuscated file from the bot's response

## 🔌 API Usage

### Authentication

Include your API key in requests:

```bash
# Header method (recommended)
curl -X POST http://localhost:3000/api/obfuscate \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello, World!\")"}'

# Query parameter method
curl -X POST http://localhost:3000/api/obfuscate?apiKey=your_api_key_here \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello, World!\")"}'
```

### Endpoints

#### POST `/api/obfuscate`

Obfuscate Lua code.

**Request:**
```json
{
  "code": "local function test() print('hello') end",
  "options": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "-- obfuscated code here",
    "jobId": "uuid-here",
    "stats": {
      "originalSize": 45,
      "obfuscatedSize": 12843,
      "ratio": "285.40"
    }
  },
  "usage": {
    "hourly": 1,
    "limit": 100
  }
}
```

#### POST `/api/validate`

Validate Lua code syntax.

**Request:**
```json
{
  "code": "print('test')"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "error": null
}
```

#### GET `/api/account`

Get account information.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "discord-user-id",
    "tier": "premium",
    "usage": {
      "hourly": 15,
      "daily": 45,
      "total": 1234
    },
    "limits": {
      "rateLimitPerHour": 100,
      "maxFileSize": 1048576
    },
    "features": ["basic-obfuscation", "advanced-obfuscation", "api-access"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/usage`

Get current usage statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "hourly": 15,
    "daily": 45,
    "total": 1234,
    "limit": 100,
    "resetAt": "2024-01-01T13:00:00.000Z"
  }
}
```

## 💎 Tier Comparison

| Feature | Free | Premium |
|---------|------|---------|
| **Requests/Hour** | 5 | 100 |
| **Max File Size** | 10KB | 1MB |
| **Basic Obfuscation** | ✅ | ✅ |
| **Advanced Features** | ❌ | ✅ |
| **API Access** | ❌ | ✅ |
| **Priority Queue** | ❌ | ✅ |

## 🛠️ Development

### Project Structure

```
Nexus-Obfuscator/
├── src/
│   ├── bot/                 # Discord bot
│   │   ├── index.js        # Bot main file
│   │   └── commands/       # Slash commands
│   ├── api/                # REST API
│   │   └── index.js        # API server
│   ├── obfuscator/         # Obfuscation logic
│   │   ├── index.js        # Node.js wrapper
│   │   └── obfuscator_improved.lua
│   ├── config/             # Configuration
│   └── utils/              # Utilities
├── template.out            # Lua VM template
├── package.json
└── .env
```

### Testing

```bash
# Test the obfuscator locally
echo "print('test')" > test.lua
lua src/obfuscator/obfuscator_improved.lua test.lua output.lua

# Test API endpoint
curl -X POST http://localhost:3000/api/validate \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"test\")"}'
```

## 📝 Examples

### Node.js Integration

```javascript
const axios = require('axios');

async function obfuscate(luaCode) {
  const response = await axios.post('http://localhost:3000/api/obfuscate', {
    code: luaCode
  }, {
    headers: {
      'X-API-Key': 'your_api_key_here',
      'Content-Type': 'application/json'
    }
  });

  return response.data.data.code;
}

// Usage
const code = `
local function greet(name)
  print("Hello, " .. name)
end
greet("World")
`;

obfuscate(code).then(obfuscated => {
  console.log(obfuscated);
});
```

### Python Integration

```python
import requests

def obfuscate(lua_code):
    response = requests.post(
        'http://localhost:3000/api/obfuscate',
        json={'code': lua_code},
        headers={'X-API-Key': 'your_api_key_here'}
    )
    return response.json()['data']['code']

# Usage
code = """
local function greet(name)
    print("Hello, " .. name)
end
greet("World")
"""

obfuscated = obfuscate(code)
print(obfuscated)
```

## 🔒 Security Notes

- **Keep your API key secret**: Never commit it to version control
- **Use HTTPS in production**: The API should be behind a reverse proxy with SSL
- **Rate limiting**: Built-in protection against abuse
- **Input validation**: All code is validated before processing

## 🐛 Troubleshooting

### Bot won't start

- Check your `DISCORD_TOKEN` in `.env`
- Ensure bot has proper permissions in your server
- Verify Node.js version is 16+

### API returns 401

- Verify your API key is correct
- Check the `X-API-Key` header is set
- Ensure you're using a premium account for API access

### Obfuscation fails

- Validate your Lua syntax with `/api/validate`
- Check file size limits for your tier
- Ensure `luac` is installed and in PATH

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- Discord: Join our support server
- Issues: GitHub Issues
- Email: support@example.com

---

**Made with ❤️ for the Lua community**
