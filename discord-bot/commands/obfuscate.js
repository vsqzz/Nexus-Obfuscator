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
          { name: 'Low - String encryption (~6x size)', value: 'low' },
          { name: 'Medium - Advanced obfuscation (~14x size) ⭐', value: 'medium' },
          { name: 'High - Professional VM wrap (~25x size)', value: 'high' }
        )
    ),

  async execute(interaction, { obfuscator }) {
    await interaction.deferReply({ ephemeral: true }); // Make it private

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
      const result = await obfuscator.obfuscate(code, { level });

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

      // Send just the file
      await interaction.editReply({
        content: `✅ Obfuscation complete! **${level.toUpperCase()}** level | ${result.stats.ratio}x size`,
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
