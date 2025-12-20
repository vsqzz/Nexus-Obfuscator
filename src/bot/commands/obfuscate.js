const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('obfuscate')
    .setDescription('Obfuscate a Lua script')
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('The Lua file to obfuscate')
        .setRequired(true)
    ),

  async execute(interaction, { obfuscator, authManager, config }) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.user.id;

      // Get or create user
      let user = authManager.getUser(userId);
      if (!user) {
        user = await authManager.createUser(userId, 'free');
      }

      // Check rate limit
      if (!authManager.checkRateLimit(userId)) {
        const tier = config.tiers[user.tier];
        return await interaction.editReply({
          content: `❌ Rate limit exceeded! You can obfuscate ${tier.rateLimitPerHour} files per hour.\n` +
                   `Your tier: **${tier.name}**\n` +
                   `Upgrade to Premium for ${config.tiers.premium.rateLimitPerHour} requests/hour!`
        });
      }

      // Get the attachment
      const attachment = interaction.options.getAttachment('file');

      if (!attachment) {
        return await interaction.editReply({
          content: '❌ No file attached!'
        });
      }

      // Validate file extension
      if (!attachment.name.endsWith('.lua')) {
        return await interaction.editReply({
          content: '❌ Please upload a .lua file!'
        });
      }

      // Check file size
      const maxSize = config.tiers[user.tier].maxFileSize;
      if (attachment.size > maxSize) {
        return await interaction.editReply({
          content: `❌ File too large! Maximum size for ${user.tier} tier: ${(maxSize / 1024).toFixed(0)}KB\n` +
                   `Your file: ${(attachment.size / 1024).toFixed(0)}KB`
        });
      }

      // Download the file
      const response = await fetch(attachment.url);
      const luaCode = await response.text();

      // Validate Lua syntax
      const validation = await obfuscator.validateLuaCode(luaCode);
      if (!validation.valid) {
        return await interaction.editReply({
          content: `❌ Invalid Lua code:\n\`\`\`\n${validation.error}\n\`\`\``
        });
      }

      // Obfuscate
      const result = await obfuscator.obfuscate(luaCode);

      if (!result.success) {
        return await interaction.editReply({
          content: `❌ Obfuscation failed: ${result.error}`
        });
      }

      // Increment usage
      authManager.incrementUsage(userId);

      // Create output file
      const outputFileName = attachment.name.replace('.lua', '_obfuscated.lua');
      const outputAttachment = new AttachmentBuilder(
        Buffer.from(result.code, 'utf8'),
        { name: outputFileName }
      );

      // Send response
      await interaction.editReply({
        content: `✅ **Obfuscation successful!**\n\n` +
                 `📊 **Statistics:**\n` +
                 `• Original size: ${result.stats.originalSize} bytes\n` +
                 `• Obfuscated size: ${result.stats.obfuscatedSize} bytes\n` +
                 `• Ratio: ${result.stats.ratio}x\n` +
                 `• Job ID: \`${result.jobId}\`\n\n` +
                 `📈 **Usage:** ${user.usage.hourly}/${config.tiers[user.tier].rateLimitPerHour} this hour`,
        files: [outputAttachment]
      });

    } catch (error) {
      console.error('[OBFUSCATE] Error:', error);
      await interaction.editReply({
        content: '❌ An unexpected error occurred during obfuscation.'
      });
    }
  }
};
