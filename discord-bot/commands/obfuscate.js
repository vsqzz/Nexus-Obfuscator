const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('obfuscate')
    .setDescription('Obfuscate a Lua/Luau script')
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('Lua script file to obfuscate')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('level')
        .setDescription('Obfuscation level')
        .addChoices(
          { name: 'Low - Fast, basic protection', value: 'low' },
          { name: 'Medium - Balanced (Recommended)', value: 'medium' },
          { name: 'High - Maximum protection', value: 'high' }
        )
    ),

  async execute(interaction, { obfuscator }) {
    await interaction.deferReply();

    try {
      const attachment = interaction.options.getAttachment('file');
      const level = interaction.options.getString('level') || 'medium';

      // Validate file
      if (!attachment.name.endsWith('.lua') && !attachment.name.endsWith('.luau') && !attachment.name.endsWith('.txt')) {
        return await interaction.editReply({
          content: '❌ Invalid file type! Please upload a `.lua`, `.luau`, or `.txt` file.',
          ephemeral: true
        });
      }

      // Check file size (5MB limit)
      if (attachment.size > 5 * 1024 * 1024) {
        return await interaction.editReply({
          content: '❌ File too large! Maximum size is 5MB.',
          ephemeral: true
        });
      }

      // Download file
      await interaction.editReply('📥 Downloading file...');
      const response = await fetch(attachment.url);
      const code = await response.text();

      // Validate code
      const validation = obfuscator.validate(code);
      if (!validation.valid) {
        return await interaction.editReply({
          content: `❌ Invalid Lua code: ${validation.error}`,
          ephemeral: true
        });
      }

      // Obfuscate
      await interaction.editReply('🔒 Obfuscating...');
      const result = obfuscator.obfuscate(code, { level });

      if (!result.success) {
        return await interaction.editReply({
          content: `❌ Obfuscation failed: ${result.error}`,
          ephemeral: true
        });
      }

      // Create output file
      const outputFilename = `obfuscated_${attachment.name}`;
      const outputBuffer = Buffer.from(result.code, 'utf-8');
      const outputAttachment = new AttachmentBuilder(outputBuffer, { name: outputFilename });

      // Create embed
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Obfuscation Complete!')
        .setDescription(`Your script has been obfuscated with **${level.toUpperCase()}** level protection.`)
        .addFields(
          { name: '📊 Statistics', value: '━━━━━━━━━━━━━━━', inline: false },
          { name: 'Original Size', value: `${result.stats.originalSize.toLocaleString()} bytes`, inline: true },
          { name: 'Obfuscated Size', value: `${result.stats.obfuscatedSize.toLocaleString()} bytes`, inline: true },
          { name: 'Size Ratio', value: `${result.stats.ratio}x`, inline: true },
          { name: 'Strings Encrypted', value: `${result.stats.stringsEncrypted}`, inline: true },
          { name: 'Numbers Obfuscated', value: `${result.stats.numbersObfuscated}`, inline: true },
          { name: 'Variables Renamed', value: `${result.stats.variablesRenamed}`, inline: true },
          { name: '\u200B', value: '━━━━━━━━━━━━━━━', inline: false },
          {
            name: '🎮 How to use in Roblox',
            value: '```lua\n-- Upload to GitHub and use:\nloadstring(game:HttpGet("YOUR_RAW_URL"))()\n\n-- Or use directly:\nloadstring([[\n' +
                   '  -- paste obfuscated code here\n]])()\n```',
            inline: false
          },
          {
            name: '💡 Tips',
            value: '• Use **Medium** level for best balance\n• **High** level may impact performance\n• Always test obfuscated code before deploying',
            inline: false
          }
        )
        .setFooter({ text: 'Nexus Obfuscator v2.0 • Made for Roblox/Luau' })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
        files: [outputAttachment]
      });

    } catch (error) {
      console.error('Obfuscate command error:', error);
      await interaction.editReply({
        content: `❌ An error occurred: ${error.message}`,
        ephemeral: true
      });
    }
  }
};
