#!/usr/bin/env node

/**
 * Nexus Obfuscator Discord Bot
 * A powerful Lua/Luau obfuscator for Roblox scripts
 */

const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LuauObfuscator = require('./obfuscator');

class NexusBot {
  constructor() {
    // Initialize Discord client
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ]
    });

    // Initialize obfuscator
    this.obfuscator = new LuauObfuscator();

    // Commands collection
    this.commands = new Collection();

    // Configuration
    this.config = {
      token: process.env.DISCORD_TOKEN,
      clientId: process.env.CLIENT_ID
    };
  }

  /**
   * Load all commands from the commands folder
   */
  loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log('📂 Loading commands...');

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
        console.log(`  ✅ Loaded: ${command.data.name}`);
      } else {
        console.log(`  ⚠️  Skipped ${file}: Missing 'data' or 'execute' property`);
      }
    }

    console.log(`\n✅ Loaded ${this.commands.size} commands\n`);
  }

  /**
   * Register slash commands with Discord
   */
  async registerCommands() {
    const commands = [];
    for (const command of this.commands.values()) {
      commands.push(command.data.toJSON());
    }

    const rest = new REST().setToken(this.config.token);

    try {
      console.log('🔄 Registering slash commands with Discord...');

      await rest.put(
        Routes.applicationCommands(this.config.clientId),
        { body: commands }
      );

      console.log('✅ Successfully registered slash commands!\n');
    } catch (error) {
      console.error('❌ Error registering commands:', error);
      throw error;
    }
  }

  /**
   * Setup event handlers
   */
  setupEvents() {
    // Ready event
    this.client.once('ready', () => {
      console.log('═══════════════════════════════════════');
      console.log(`✅ Bot is online!`);
      console.log(`👤 Logged in as: ${this.client.user.tag}`);
      console.log(`🆔 Client ID: ${this.client.user.id}`);
      console.log(`🌐 Serving ${this.client.guilds.cache.size} server(s)`);
      console.log('═══════════════════════════════════════\n');

      // Set bot activity
      this.client.user.setActivity('Obfuscating Lua scripts', { type: 3 }); // Type 3 = WATCHING
    });

    // Interaction handler (slash commands)
    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        console.error(`❌ Unknown command: ${interaction.commandName}`);
        return;
      }

      try {
        console.log(`🔹 ${interaction.user.tag} used /${interaction.commandName}`);

        await command.execute(interaction, {
          obfuscator: this.obfuscator,
          client: this.client
        });

      } catch (error) {
        console.error(`❌ Error executing /${interaction.commandName}:`, error);

        const errorMessage = {
          content: '❌ An error occurred while executing this command!',
          ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    });

    // Error handlers
    this.client.on('error', (error) => {
      console.error('❌ Discord client error:', error);
    });

    process.on('unhandledRejection', (error) => {
      console.error('❌ Unhandled promise rejection:', error);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal) => {
      console.log(`\n\n🛑 Received ${signal} - Shutting down gracefully...`);

      try {
        // Destroy Discord client
        await this.client.destroy();
        console.log('✅ Discord client disconnected');

        // Clear command cache for hot reload
        if (process.env.NODE_ENV === 'development') {
          for (const file of Object.keys(require.cache)) {
            if (file.includes('commands/') || file.includes('obfuscator.js')) {
              delete require.cache[file];
            }
          }
          console.log('✅ Command cache cleared for reload');
        }

        console.log('👋 Shutdown complete\n');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Handle nodemon restarts
    process.once('SIGUSR2', async () => {
      console.log('\n\n🔄 Hot reload triggered...');
      await shutdown('SIGUSR2');
      process.kill(process.pid, 'SIGUSR2');
    });
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    if (!this.config.token) {
      console.error('❌ ERROR: DISCORD_TOKEN not found in .env file!\n');
      console.log('Please follow these steps:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Add your Discord bot token to .env');
      console.log('3. Get your token at: https://discord.com/developers/applications\n');
      process.exit(1);
    }

    if (!this.config.clientId) {
      console.error('❌ ERROR: CLIENT_ID not found in .env file!\n');
      console.log('Please add your bot\'s Client ID to the .env file');
      console.log('Find it at: https://discord.com/developers/applications\n');
      process.exit(1);
    }
  }

  /**
   * Start the bot
   */
  async start() {
    try {
      console.clear();
      console.log('═══════════════════════════════════════');
      console.log('  🔒 Nexus Obfuscator Bot v2.0');
      console.log('  Discord Bot for Lua/Luau Obfuscation');
      console.log('═══════════════════════════════════════\n');

      // Validate configuration
      this.validateConfig();

      // Load commands
      this.loadCommands();

      // Register commands
      await this.registerCommands();

      // Setup events
      this.setupEvents();

      // Login to Discord
      console.log('🔐 Logging in to Discord...\n');
      await this.client.login(this.config.token);

    } catch (error) {
      console.error('❌ Failed to start bot:', error.message);

      if (error.message.includes('sessions remaining')) {
        console.log('\n⚠️  DISCORD RATE LIMIT HIT!');
        console.log('Your bot token has reached the session limit.');
        console.log('\nSolutions:');
        console.log('1. Wait 24 hours for the limit to reset');
        console.log('2. Create a new bot token at:');
        console.log('   https://discord.com/developers/applications');
        console.log('3. Reset your token in the Bot settings\n');
      } else if (error.message.includes('token')) {
        console.log('\n⚠️  INVALID TOKEN!');
        console.log('Please check your DISCORD_TOKEN in .env file\n');
      }

      process.exit(1);
    }
  }
}

// Run the bot if this file is executed directly
if (require.main === module) {
  const bot = new NexusBot();
  bot.start();
}

module.exports = NexusBot;
