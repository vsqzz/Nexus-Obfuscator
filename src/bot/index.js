const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const LuaObfuscator = require('../obfuscator');
const authManager = require('../utils/auth');

class ObfuscatorBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ]
    });

    this.commands = new Collection();
    this.obfuscator = new LuaObfuscator({
      tempDir: config.obfuscator.tempDir
    });
  }

  async initialize() {
    await this.obfuscator.initialize();
    await this.loadCommands();
    await this.registerCommands();
    this.setupEventHandlers();
  }

  async loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
        console.log(`[BOT] Loaded command: ${command.data.name}`);
      }
    }
  }

  async registerCommands() {
    const commands = [];
    for (const command of this.commands.values()) {
      commands.push(command.data.toJSON());
    }

    const rest = new REST().setToken(config.discord.token);

    try {
      console.log('[BOT] Registering slash commands...');

      await rest.put(
        Routes.applicationCommands(config.discord.clientId),
        { body: commands }
      );

      console.log('[BOT] Successfully registered commands!');
    } catch (error) {
      console.error('[BOT] Error registering commands:', error);
    }
  }

  setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`[BOT] Logged in as ${this.client.user.tag}!`);
      this.client.user.setActivity('Obfuscating Lua scripts', { type: 'WATCHING' });
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        console.error(`[BOT] No command matching ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction, {
          obfuscator: this.obfuscator,
          authManager,
          config
        });
      } catch (error) {
        console.error(`[BOT] Error executing ${interaction.commandName}:`, error);

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
  }

  async start() {
    try {
      await this.initialize();
      await this.client.login(config.discord.token);
    } catch (error) {
      console.error('[BOT] Failed to start bot:', error);
      process.exit(1);
    }
  }

  async stop() {
    await this.client.destroy();
    console.log('[BOT] Bot stopped');
  }
}

// Run bot if called directly
if (require.main === module) {
  const bot = new ObfuscatorBot();
  bot.start();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n[BOT] Shutting down...');
    await bot.stop();
    process.exit(0);
  });
}

module.exports = ObfuscatorBot;
