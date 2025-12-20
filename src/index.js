#!/usr/bin/env node

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
        const botInstance = new ObfuscatorBot();
        const apiInstance = new ObfuscatorAPI();

        await Promise.all([
          botInstance.start(),
          apiInstance.start()
        ]);

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

  } catch (error) {
    console.error('[MAIN] Failed to start services:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ObfuscatorBot, ObfuscatorAPI };
