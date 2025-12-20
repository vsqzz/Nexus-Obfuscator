const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premium')
    .setDescription('View premium tier information'),

  async execute(interaction, { authManager }) {
    const userId = interaction.user.id;
    let user = authManager.getUser(userId);

    if (!user) {
      user = await authManager.createUser(userId, 'free');
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('💎 Premium Tier')
      .setDescription('Unlock the full power of Nexus Obfuscator!')
      .addFields(
        {
          name: '✨ Premium Features',
          value: '• **100 requests/hour** (vs 5 free)\n' +
                 '• **1MB file size** (vs 10KB free)\n' +
                 '• **API Access** with personal key\n' +
                 '• **Advanced obfuscation** options\n' +
                 '• **Priority processing** queue\n' +
                 '• **Premium support**',
          inline: false
        },
        {
          name: '💰 Pricing',
          value: '*Coming Soon*\n' +
                 'Pricing tiers will be announced soon.\n' +
                 'DM the bot owner for early access!',
          inline: false
        },
        {
          name: '🔑 Current Status',
          value: user.tier === 'premium'
                 ? '✅ You have **Premium**!'
                 : '❌ You have **Free** tier',
          inline: false
        }
      )
      .setFooter({
        text: 'Questions? Contact the bot administrator'
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
