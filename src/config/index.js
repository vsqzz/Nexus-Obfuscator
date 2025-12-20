require('dotenv').config();

module.exports = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
  },

  api: {
    port: process.env.API_PORT || 3000,
    secret: process.env.API_SECRET || 'change-me-in-production',
    jwtSecret: process.env.JWT_SECRET || 'change-jwt-secret-in-production',
  },

  rateLimits: {
    free: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: parseInt(process.env.FREE_TIER_RATE_LIMIT) || 5,
    },
    premium: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: parseInt(process.env.PREMIUM_TIER_RATE_LIMIT) || 100,
    },
  },

  obfuscator: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 1048576, // 1MB
    tempDir: process.env.TEMP_DIR || './temp',
  },

  tiers: {
    free: {
      name: 'Free',
      maxFileSize: 10240, // 10KB
      rateLimitPerHour: 5,
      features: ['basic-obfuscation']
    },
    premium: {
      name: 'Premium',
      maxFileSize: 1048576, // 1MB
      rateLimitPerHour: 100,
      features: ['basic-obfuscation', 'advanced-obfuscation', 'priority-queue', 'api-access']
    }
  }
};
