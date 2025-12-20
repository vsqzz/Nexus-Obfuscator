const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show help information'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle('📚 Nexus Obfuscator Help')
      .setDescription('Advanced Lua obfuscation service')
      .addFields(
        {
          name: '📝 Commands',
          value: '`/obfuscate` - Obfuscate a Lua file\n' +
                 '`/account` - View your account info\n' +
                 '`/help` - Show this help message\n' +
                 '`/premium` - View premium information',
          inline: false
        },
        {
          name: '🚀 How to Use',
          value: '1. Use `/obfuscate` command\n' +
                 '2. Attach your .lua file\n' +
                 '3. Receive obfuscated code\n' +
                 '4. Download and use!',
          inline: false
        },
        {
          name: '⚡ Features',
          value: '• Bytecode obfuscation\n' +
                 '• Variable name randomization\n' +
                 '• Custom VM protection\n' +
                 '• Fast processing\n' +
                 '• High success rate',
          inline: false
        },
        {
          name: '🆓 Free Tier',
          value: '• 5 obfuscations per hour\n' +
                 '• 10KB max file size\n' +
                 '• Basic obfuscation',
          inline: true
        },
        {
          name: '💎 Premium Tier',
          value: '• 100 obfuscations per hour\n' +
                 '• 1MB max file size\n' +
                 '• Advanced features\n' +
                 '• API access',
          inline: true
        }
      )
      .setFooter({
        text: 'Use /premium for upgrade information'
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
