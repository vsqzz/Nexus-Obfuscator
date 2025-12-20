#!/usr/bin/env node

/**
 * Nexus Obfuscator - Standalone Bot Launcher
 *
 * This file allows you to run just the Discord bot independently.
 * It's useful for testing or running only the bot service.
 *
 * Usage: node bot.js
 */

const path = require('path');
const ObfuscatorBot = require('./src/bot');

console.log('='.repeat(50));
console.log('  Nexus Obfuscator - Discord Bot');
console.log('='.repeat(50));
console.log();

async function startBot() {
  try {
    const config = require('./src/config');

    if (!config.discord.token) {
      console.error('❌ ERROR: DISCORD_TOKEN not set!');
      console.log();
      console.log('Setup required:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Add your Discord bot token to .env');
      console.log('3. Restart the bot');
      console.log();
      console.log('Get a token at: https://discord.com/developers/applications');
      process.exit(1);
    }

    const bot = new ObfuscatorBot();
    await bot.start();

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n[BOT] Shutting down...');
      await bot.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start bot:', error.message);

    if (error.message.includes('sessions remaining')) {
      const resetMatch = error.message.match(/resets at (.+)/);
      if (resetMatch) {
        console.log();
        console.log('⚠️  Discord Rate Limit Hit!');
        console.log(`Rate limit resets at: ${new Date(resetMatch[1]).toLocaleString()}`);
        console.log();
        console.log('Solutions:');
        console.log('1. Wait for the rate limit to reset (usually ~24 hours)');
        console.log('2. Go to https://discord.com/developers/applications');
        console.log('3. Select your application → Bot → Reset Token');
        console.log('4. Update DISCORD_TOKEN in .env with the new token');
      }
    }

    process.exit(1);
  }
}

startBot();
