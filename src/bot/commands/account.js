const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('account')
    .setDescription('View your account information'),

  async execute(interaction, { authManager, config }) {
    const userId = interaction.user.id;

    // Get or create user
    let user = authManager.getUser(userId);
    if (!user) {
      user = await authManager.createUser(userId, 'free');
    }

    const tierConfig = config.tiers[user.tier];

    const embed = new EmbedBuilder()
      .setColor(user.tier === 'premium' ? '#FFD700' : '#3498db')
      .setTitle('🔐 Your Account')
      .setDescription(`Account information for ${interaction.user.tag}`)
      .addFields(
        {
          name: '🎫 Tier',
          value: `**${tierConfig.name}**`,
          inline: true
        },
        {
          name: '📊 Usage (This Hour)',
          value: `${user.usage.hourly}/${tierConfig.rateLimitPerHour}`,
          inline: true
        },
        {
          name: '📈 Total Obfuscations',
          value: `${user.usage.total}`,
          inline: true
        },
        {
          name: '📁 Max File Size',
          value: `${(tierConfig.maxFileSize / 1024).toFixed(0)}KB`,
          inline: true
        },
        {
          name: '🔑 API Key',
          value: user.tier === 'premium' ? `\`${user.apiKey}\`` : '*Premium Only*',
          inline: false
        },
        {
          name: '✨ Features',
          value: tierConfig.features.map(f => `• ${f}`).join('\n'),
          inline: false
        }
      )
      .setFooter({
        text: `Account created: ${user.createdAt.toLocaleDateString()}`
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
