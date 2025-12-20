const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('obfuscate')
    .setDescription('Obfuscate a Lua/Luau script (Roblox compatible)')
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('The Lua file to obfuscate')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('level')
        .setDescription('Obfuscation level')
        .setRequired(false)
        .addChoices(
          { name: 'Low - Fast, readable', value: 'low' },
          { name: 'Medium - Balanced (recommended)', value: 'medium' },
          { name: 'High - Maximum protection', value: 'high' }
        )
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Obfuscation type')
        .setRequired(false)
        .addChoices(
          { name: 'Luau (Roblox) - Recommended', value: 'luau' },
          { name: 'Standard Lua 5.1', value: 'standard' }
        )
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
          content: `❌ **Rate Limit Exceeded!**\n\n` +
                   `You can obfuscate **${tier.rateLimitPerHour}** files per hour.\n` +
                   `Your tier: **${tier.name}**\n\n` +
                   `💎 Upgrade to Premium for **${config.tiers.premium.rateLimitPerHour}** requests/hour!\n` +
                   `Use \`/premium\` for more info.`
        });
      }

      // Get the attachment
      const attachment = interaction.options.getAttachment('file');
      const level = interaction.options.getString('level') || 'medium';
      const type = interaction.options.getString('type') || 'luau';

      if (!attachment) {
        return await interaction.editReply({
          content: '❌ No file attached!'
        });
      }

      // Validate file extension
      if (!attachment.name.endsWith('.lua') && !attachment.name.endsWith('.luau')) {
        return await interaction.editReply({
          content: '❌ Please upload a **.lua** or **.luau** file!'
        });
      }

      // Check file size
      const maxSize = config.tiers[user.tier].maxFileSize;
      if (attachment.size > maxSize) {
        return await interaction.editReply({
          content: `❌ **File Too Large!**\n\n` +
                   `Maximum size for **${user.tier}** tier: **${(maxSize / 1024).toFixed(0)}KB**\n` +
                   `Your file: **${(attachment.size / 1024).toFixed(0)}KB**\n\n` +
                   `💡 Tip: Upgrade to Premium for larger files!`
        });
      }

      // Download the file
      const response = await fetch(attachment.url);
      const luaCode = await response.text();

      // Validate Lua syntax
      const validation = await obfuscator.validateLuaCode(luaCode);
      if (!validation.valid) {
        return await interaction.editReply({
          content: `❌ **Invalid Lua Code:**\n\`\`\`\n${validation.error}\n\`\`\`\n\n` +
                   `Please fix the syntax errors and try again.`
        });
      }

      // Update status
      await interaction.editReply({
        content: `🔄 **Obfuscating...**\n` +
                 `• Type: **${type === 'luau' ? 'Luau (Roblox)' : 'Standard Lua 5.1'}**\n` +
                 `• Level: **${level}**\n` +
                 `• Size: **${(attachment.size / 1024).toFixed(2)}KB**\n\n` +
                 `Please wait...`
      });

      // Obfuscate with options
      const result = await obfuscator.obfuscate(luaCode, { level, type });

      if (!result.success) {
        return await interaction.editReply({
          content: `❌ **Obfuscation Failed:**\n\`\`\`\n${result.error}\n\`\`\`\n\n` +
                   `Please check your code and try again.`
        });
      }

      // Increment usage
      authManager.incrementUsage(userId);

      // Create output file
      const outputFileName = attachment.name.replace(/\.luau?$/, '_obfuscated.lua');
      const outputAttachment = new AttachmentBuilder(
        Buffer.from(result.code, 'utf8'),
        { name: outputFileName }
      );

      // Send response with enhanced info
      const embed = {
        color: 0x00ff00,
        title: '✅ Obfuscation Successful!',
        fields: [
          {
            name: '📊 Statistics',
            value: `\`\`\`\n` +
                   `Original:    ${result.stats.originalSize.toLocaleString()} bytes\n` +
                   `Obfuscated:  ${result.stats.obfuscatedSize.toLocaleString()} bytes\n` +
                   `Ratio:       ${result.stats.ratio}x\n` +
                   `Level:       ${level}\n` +
                   `Type:        ${type === 'luau' ? 'Luau (Roblox)' : 'Lua 5.1'}\n` +
                   `\`\`\``,
            inline: false
          },
          {
            name: '🚀 Usage',
            value: `${user.usage.hourly}/${config.tiers[user.tier].rateLimitPerHour} requests this hour`,
            inline: true
          },
          {
            name: '🆔 Job ID',
            value: `\`${result.jobId}\``,
            inline: true
          }
        ],
        footer: {
          text: type === 'luau' ?
            'Roblox: Use loadstring() or require() with this script' :
            'Standard Lua: Compatible with Lua 5.1'
        },
        timestamp: new Date()
      };

      // Add usage instructions for Roblox
      if (type === 'luau') {
        embed.fields.push({
          name: '📝 Roblox Usage',
          value: `\`\`\`lua\n` +
                 `-- Method 1: Direct loadstring\n` +
                 `loadstring(game:HttpGet("YOUR_RAW_URL"))())\n\n` +
                 `-- Method 2: With pcall\n` +
                 `local success, err = pcall(function()\n` +
                 `    loadstring(game:HttpGet("YOUR_RAW_URL"))())\n` +
                 `end)\n` +
                 `\`\`\``,
          inline: false
        });
      }

      await interaction.editReply({
        content: null,
        embeds: [embed],
        files: [outputAttachment]
      });

    } catch (error) {
      console.error('[OBFUSCATE] Error:', error);
      await interaction.editReply({
        content: `❌ **An unexpected error occurred:**\n\`\`\`\n${error.message}\n\`\`\`\n\n` +
                 `Please try again or contact support if the issue persists.`
      });
    }
  }
};
