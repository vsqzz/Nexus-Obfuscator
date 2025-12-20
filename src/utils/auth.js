const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

class AuthManager {
  constructor() {
    this.users = new Map(); // In production, use a real database
    this.apiKeys = new Map(); // Store API keys
  }

  generateApiKey() {
    const key = 'nxs_' + Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
    return key;
  }

  async createUser(userId, tier = 'free') {
    const apiKey = this.generateApiKey();

    const user = {
      userId,
      tier,
      apiKey,
      createdAt: new Date(),
      usage: {
        hourly: 0,
        daily: 0,
        total: 0,
        lastReset: new Date()
      }
    };

    this.users.set(userId, user);
    this.apiKeys.set(apiKey, userId);

    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  getUserByApiKey(apiKey) {
    const userId = this.apiKeys.get(apiKey);
    return userId ? this.users.get(userId) : null;
  }

  upgradeToPremium(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.tier = 'premium';
      return true;
    }
    return false;
  }

  checkRateLimit(userId) {
    const user = this.users.get(userId);
    if (!user) return false;

    const limits = config.rateLimits[user.tier];
    const now = new Date();
    const hoursSinceReset = (now - user.usage.lastReset) / (1000 * 60 * 60);

    // Reset if an hour has passed
    if (hoursSinceReset >= 1) {
      user.usage.hourly = 0;
      user.usage.lastReset = now;
    }

    // Check if under limit
    if (user.usage.hourly >= limits.max) {
      return false;
    }

    return true;
  }

  incrementUsage(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.usage.hourly++;
      user.usage.daily++;
      user.usage.total++;
    }
  }

  generateJWT(userId, tier) {
    return jwt.sign(
      { userId, tier },
      config.api.jwtSecret,
      { expiresIn: '30d' }
    );
  }

  verifyJWT(token) {
    try {
      return jwt.verify(token, config.api.jwtSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthManager();
