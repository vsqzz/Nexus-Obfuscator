#!/usr/bin/env node

// Root entry point - redirects to src/index.js
const path = require('path');
const srcIndex = path.join(__dirname, 'src', 'index.js');

try {
  require(srcIndex);
} catch (error) {
  console.error('Failed to start Nexus Obfuscator:', error.message);

  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('\n📦 Installing dependencies...');
    console.log('Run: npm install');
  } else if (error.message.includes('DISCORD_TOKEN')) {
    console.log('\n🔑 Configuration needed!');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Discord bot token');
    console.log('3. Restart the application');
  } else if (error.message.includes('sessions remaining')) {
    console.log('\n⚠️  Discord Rate Limit!');
    console.log('Your bot token has hit the session limit.');
    console.log('Solution: Wait a few minutes or get a new bot token');
    console.log('Create new token at: https://discord.com/developers/applications');
  }

  process.exit(1);
}
