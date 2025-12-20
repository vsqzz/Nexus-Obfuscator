# 🔌 Nexus Obfuscator API - Usage Examples

Complete guide with examples in multiple languages for integrating the Nexus Obfuscator API.

## 📋 Table of Contents

- [Authentication](#authentication)
- [JavaScript/Node.js](#javascriptnodejs)
- [Python](#python)
- [cURL](#curl)
- [PHP](#php)
- [Ruby](#ruby)
- [Error Handling](#error-handling)

## Authentication

All API requests require an API key. Include it in the request header:

```
X-API-Key: your_api_key_here
```

Or as a query parameter:

```
?apiKey=your_api_key_here
```

## JavaScript/Node.js

### Using Axios

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000';
const API_KEY = 'your_api_key_here';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Obfuscate code
async function obfuscate(code) {
  try {
    const response = await api.post('/api/obfuscate', { code });
    return response.data;
  } catch (error) {
    console.error('Obfuscation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Validate code
async function validate(code) {
  try {
    const response = await api.post('/api/validate', { code });
    return response.data;
  } catch (error) {
    console.error('Validation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Get account info
async function getAccount() {
  try {
    const response = await api.get('/api/account');
    return response.data;
  } catch (error) {
    console.error('Failed to get account:', error.response?.data || error.message);
    throw error;
  }
}

// Get usage stats
async function getUsage() {
  try {
    const response = await api.get('/api/usage');
    return response.data;
  } catch (error) {
    console.error('Failed to get usage:', error.response?.data || error.message);
    throw error;
  }
}

// Example usage
(async () => {
  const luaCode = `
    local function greet(name)
      print("Hello, " .. name)
    end
    greet("World")
  `;

  // Validate first
  const validationResult = await validate(luaCode);
  if (validationResult.valid) {
    console.log('✅ Code is valid!');

    // Obfuscate
    const result = await obfuscate(luaCode);
    console.log('✅ Obfuscation successful!');
    console.log('Job ID:', result.data.jobId);
    console.log('Stats:', result.data.stats);
    console.log('\nObfuscated code:');
    console.log(result.data.code);

    // Check usage
    const usage = await getUsage();
    console.log('\nUsage:', usage.data);
  } else {
    console.log('❌ Code is invalid:', validationResult.error);
  }
})();
```

### Using Fetch (Native)

```javascript
const API_URL = 'http://localhost:3000';
const API_KEY = 'your_api_key_here';

async function obfuscate(code) {
  const response = await fetch(`${API_URL}/api/obfuscate`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Usage
obfuscate('print("Hello")').then(result => {
  console.log(result.data.code);
});
```

## Python

### Using Requests

```python
import requests
import json

API_URL = 'http://localhost:3000'
API_KEY = 'your_api_key_here'

class NexusObfuscator:
    def __init__(self, api_url=API_URL, api_key=API_KEY):
        self.api_url = api_url
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }

    def obfuscate(self, code, options=None):
        """Obfuscate Lua code"""
        payload = {'code': code}
        if options:
            payload['options'] = options

        response = requests.post(
            f'{self.api_url}/api/obfuscate',
            headers=self.headers,
            json=payload
        )

        if response.status_code != 200:
            raise Exception(f"API Error: {response.json().get('error')}")

        return response.json()

    def validate(self, code):
        """Validate Lua code"""
        response = requests.post(
            f'{self.api_url}/api/validate',
            headers=self.headers,
            json={'code': code}
        )

        if response.status_code != 200:
            raise Exception(f"API Error: {response.json().get('error')}")

        return response.json()

    def get_account(self):
        """Get account information"""
        response = requests.get(
            f'{self.api_url}/api/account',
            headers=self.headers
        )

        if response.status_code != 200:
            raise Exception(f"API Error: {response.json().get('error')}")

        return response.json()

    def get_usage(self):
        """Get usage statistics"""
        response = requests.get(
            f'{self.api_url}/api/usage',
            headers=self.headers
        )

        if response.status_code != 200:
            raise Exception(f"API Error: {response.json().get('error')}")

        return response.json()

# Example usage
if __name__ == '__main__':
    obfuscator = NexusObfuscator()

    lua_code = """
    local function greet(name)
        print("Hello, " .. name)
    end
    greet("World")
    """

    try:
        # Validate
        validation = obfuscator.validate(lua_code)
        if validation['valid']:
            print('✅ Code is valid!')

            # Obfuscate
            result = obfuscator.obfuscate(lua_code)
            print('✅ Obfuscation successful!')
            print(f"Job ID: {result['data']['jobId']}")
            print(f"Stats: {result['data']['stats']}")
            print(f"\nObfuscated code:\n{result['data']['code']}")

            # Check usage
            usage = obfuscator.get_usage()
            print(f"\nUsage: {usage['data']['hourly']}/{usage['data']['limit']}")
        else:
            print(f"❌ Code is invalid: {validation['error']}")

    except Exception as e:
        print(f"Error: {e}")
```

## cURL

### Obfuscate Code

```bash
curl -X POST http://localhost:3000/api/obfuscate \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "local x = 5\nprint(x)"
  }' | jq
```

### Validate Code

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"test\")"
  }' | jq
```

### Get Account Info

```bash
curl http://localhost:3000/api/account \
  -H "X-API-Key: your_api_key_here" | jq
```

### Get Usage Stats

```bash
curl http://localhost:3000/api/usage \
  -H "X-API-Key: your_api_key_here" | jq
```

### Obfuscate from File

```bash
# Read Lua file and obfuscate
CODE=$(cat script.lua | jq -Rs .)
curl -X POST http://localhost:3000/api/obfuscate \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d "{\"code\": $CODE}" \
  | jq -r '.data.code' > script_obfuscated.lua
```

## PHP

```php
<?php

class NexusObfuscator {
    private $apiUrl;
    private $apiKey;

    public function __construct($apiUrl, $apiKey) {
        $this->apiUrl = $apiUrl;
        $this->apiKey = $apiKey;
    }

    private function request($method, $endpoint, $data = null) {
        $ch = curl_init($this->apiUrl . $endpoint);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-API-Key: ' . $this->apiKey,
            'Content-Type: application/json'
        ]);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        if ($httpCode !== 200) {
            throw new Exception($decoded['error'] ?? 'API request failed');
        }

        return $decoded;
    }

    public function obfuscate($code, $options = []) {
        return $this->request('POST', '/api/obfuscate', [
            'code' => $code,
            'options' => $options
        ]);
    }

    public function validate($code) {
        return $this->request('POST', '/api/validate', ['code' => $code]);
    }

    public function getAccount() {
        return $this->request('GET', '/api/account');
    }

    public function getUsage() {
        return $this->request('GET', '/api/usage');
    }
}

// Example usage
$obfuscator = new NexusObfuscator(
    'http://localhost:3000',
    'your_api_key_here'
);

$luaCode = <<<LUA
local function greet(name)
    print("Hello, " .. name)
end
greet("World")
LUA;

try {
    // Validate
    $validation = $obfuscator->validate($luaCode);

    if ($validation['valid']) {
        echo "✅ Code is valid!\n";

        // Obfuscate
        $result = $obfuscator->obfuscate($luaCode);
        echo "✅ Obfuscation successful!\n";
        echo "Job ID: " . $result['data']['jobId'] . "\n";
        echo "Stats: " . json_encode($result['data']['stats']) . "\n";
        echo "\nObfuscated code:\n" . $result['data']['code'] . "\n";

        // Check usage
        $usage = $obfuscator->getUsage();
        echo "\nUsage: " . $usage['data']['hourly'] . "/" . $usage['data']['limit'] . "\n";
    } else {
        echo "❌ Code is invalid: " . $validation['error'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

## Ruby

```ruby
require 'net/http'
require 'json'
require 'uri'

class NexusObfuscator
  def initialize(api_url, api_key)
    @api_url = api_url
    @api_key = api_key
  end

  def obfuscate(code, options = {})
    request('POST', '/api/obfuscate', { code: code, options: options })
  end

  def validate(code)
    request('POST', '/api/validate', { code: code })
  end

  def get_account
    request('GET', '/api/account')
  end

  def get_usage
    request('GET', '/api/usage')
  end

  private

  def request(method, endpoint, data = nil)
    uri = URI("#{@api_url}#{endpoint}")
    http = Net::HTTP.new(uri.host, uri.port)

    request = case method
    when 'GET'
      Net::HTTP::Get.new(uri)
    when 'POST'
      req = Net::HTTP::Post.new(uri)
      req.body = data.to_json if data
      req
    end

    request['X-API-Key'] = @api_key
    request['Content-Type'] = 'application/json'

    response = http.request(request)
    JSON.parse(response.body)
  end
end

# Example usage
obfuscator = NexusObfuscator.new(
  'http://localhost:3000',
  'your_api_key_here'
)

lua_code = <<~LUA
  local function greet(name)
    print("Hello, " .. name)
  end
  greet("World")
LUA

begin
  # Validate
  validation = obfuscator.validate(lua_code)

  if validation['valid']
    puts '✅ Code is valid!'

    # Obfuscate
    result = obfuscator.obfuscate(lua_code)
    puts '✅ Obfuscation successful!'
    puts "Job ID: #{result['data']['jobId']}"
    puts "Stats: #{result['data']['stats']}"
    puts "\nObfuscated code:\n#{result['data']['code']}"

    # Check usage
    usage = obfuscator.get_usage()
    puts "\nUsage: #{usage['data']['hourly']}/#{usage['data']['limit']}"
  else
    puts "❌ Code is invalid: #{validation['error']}"
  end
rescue => e
  puts "Error: #{e.message}"
end
```

## Error Handling

### Common Error Responses

```json
// 401 Unauthorized
{
  "success": false,
  "error": "API key required"
}

// 429 Rate Limit
{
  "success": false,
  "error": "Rate limit exceeded",
  "limit": 100,
  "resetAt": "2024-01-01T13:00:00.000Z"
}

// 400 Bad Request
{
  "success": false,
  "error": "Invalid Lua code",
  "details": "syntax error near 'end'"
}

// 413 Payload Too Large
{
  "success": false,
  "error": "Code too large. Maximum size: 1048576 bytes"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Internal server error"
}
```

### Error Handling Example (JavaScript)

```javascript
async function obfuscateWithErrorHandling(code) {
  try {
    const result = await obfuscate(code);
    return result;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          console.error('Invalid API key');
          break;
        case 429:
          console.error(`Rate limit exceeded. Resets at: ${data.resetAt}`);
          break;
        case 400:
          console.error(`Invalid code: ${data.details || data.error}`);
          break;
        case 413:
          console.error('File too large for your tier');
          break;
        default:
          console.error(`API error: ${data.error}`);
      }
    } else {
      console.error('Network error:', error.message);
    }
    throw error;
  }
}
```

---

**More examples and documentation available in the main README.md**
