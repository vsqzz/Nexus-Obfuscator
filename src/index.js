#!/usr/bin/env node

const path = require('path');

// Handle running from different locations
const rootDir = path.join(__dirname, '..');
process.chdir(rootDir);

const ObfuscatorBot = require('./bot');
const ObfuscatorAPI = require('./api');

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'all';

  console.log('='.repeat(50));
  console.log('  Nexus Obfuscator v2.0');
  console.log('  Advanced Lua Obfuscation Service');
  console.log('='.repeat(50));
  console.log();

  try {
    // Verify config
    const config = require('./config');

    if (!config.discord.token && (mode === 'bot' || mode === 'all')) {
      console.error('[ERROR] DISCORD_TOKEN not set in .env file!');
      console.log('\nPlease:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Add your Discord bot token to .env');
      console.log('3. Restart the application');
      process.exit(1);
    }

    switch (mode) {
      case 'bot':
        console.log('[MAIN] Starting Discord Bot only...');
        const bot = new ObfuscatorBot();
        await bot.start();
        break;

      case 'api':
        console.log('[MAIN] Starting API server only...');
        const api = new ObfuscatorAPI();
        await api.start();
        break;

      case 'all':
      default:
        console.log('[MAIN] Starting both Bot and API...');

        if (config.discord.token) {
          const botInstance = new ObfuscatorBot();
          const apiInstance = new ObfuscatorAPI();

          await Promise.all([
            botInstance.start(),
            apiInstance.start()
          ]);
        } else {
          console.log('[WARN] No Discord token found, starting API only...');
          const apiInstance = new ObfuscatorAPI();
          await apiInstance.start();
        }

        console.log();
        console.log('[MAIN] ✅ All services started successfully!');
        console.log();
        break;
    }

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n[MAIN] Shutting down gracefully...');
      process.exit(0);
    });

    process.on('unhandledRejection', (error) => {
      console.error('[MAIN] Unhandled rejection:', error);
    });

  } catch (error) {
    console.error('[MAIN] Failed to start services:', error.message);

    if (error.message.includes('MODULE_NOT_FOUND')) {
      console.log('\n💡 Tip: Run "npm install" to install dependencies');
    } else if (error.message.includes('sessions remaining')) {
      console.log('\n⚠️  Discord Rate Limit Hit!');
      console.log('Your bot token has reached the session limit.');
      console.log('Wait until:', error.message.match(/resets at (.+)/)?.[1] || 'the cooldown expires');
      console.log('\nOr create a new bot token at: https://discord.com/developers/applications');
    }

    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ObfuscatorBot, ObfuscatorAPI };
