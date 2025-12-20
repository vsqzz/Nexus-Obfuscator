const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show help and usage information'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('📚 Nexus Obfuscator - Help')
      .setDescription('A powerful Lua/Luau obfuscator designed for Roblox scripts.')
      .addFields(
        {
          name: '🔒 /obfuscate',
          value: 'Obfuscate a Lua script file\n**Usage:** Upload a `.lua` file and choose protection level',
          inline: false
        },
        {
          name: '📊 Protection Levels',
          value: '**Low:** String encryption only (fast)\n**Medium:** Strings + numbers (recommended)\n**High:** Full protection + variable renaming',
          inline: false
        },
        {
          name: '🎮 Roblox Usage',
          value: '```lua\n-- Method 1: From GitHub\nloadstring(game:HttpGet("RAW_URL"))()\n\n-- Method 2: Direct paste\nloadstring([[CODE]])()\n```',
          inline: false
        },
        {
          name: '✨ Features',
          value: '• XOR string encryption\n• Number obfuscation\n• Variable renaming\n• No external dependencies\n• Pure JavaScript engine\n• Roblox/Luau compatible',
          inline: false
        },
        {
          name: '⚠️ Important Notes',
          value: '• Obfuscation is NOT encryption\n• Code can still be reverse-engineered\n• Always test obfuscated scripts\n• Maximum file size: 5MB',
          inline: false
        },
        {
          name: '🔗 Links',
          value: '[GitHub](https://github.com/vsqzz/Nexus-Obfuscator) • [Report Bug](https://github.com/vsqzz/Nexus-Obfuscator/issues)',
          inline: false
        }
      )
      .setFooter({ text: 'Nexus Obfuscator v2.0' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
