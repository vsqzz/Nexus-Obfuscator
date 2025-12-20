const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const LuaObfuscator = require('../obfuscator');
const authManager = require('../utils/auth');

class ObfuscatorAPI {
  constructor() {
    this.app = express();
    this.obfuscator = new LuaObfuscator({
      tempDir: config.obfuscator.tempDir
    });
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // CORS
    this.app.use(cors());

    // Body parser
    this.app.use(express.json({ limit: '2mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '2mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`[API] ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
    });

    // API info
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Nexus Obfuscator API',
        version: '2.0.0',
        endpoints: {
          '/health': 'Health check',
          '/api/obfuscate': 'Obfuscate Lua code (POST)',
          '/api/validate': 'Validate Lua code (POST)',
          '/api/account': 'Get account info (GET)',
          '/api/usage': 'Get usage statistics (GET)'
        },
        documentation: 'https://github.com/your-repo/docs'
      });
    });

    // Obfuscation endpoint
    this.app.post('/api/obfuscate', this.authMiddleware.bind(this), async (req, res) => {
      try {
        const { code, options = {} } = req.body;

        if (!code) {
          return res.status(400).json({
            success: false,
            error: 'No code provided'
          });
        }

        // Check file size
        const maxSize = config.tiers[req.user.tier].maxFileSize;
        if (code.length > maxSize) {
          return res.status(413).json({
            success: false,
            error: `Code too large. Maximum size: ${maxSize} bytes`
          });
        }

        // Validate Lua code
        const validation = await this.obfuscator.validateLuaCode(code);
        if (!validation.valid) {
          return res.status(400).json({
            success: false,
            error: 'Invalid Lua code',
            details: validation.error
          });
        }

        // Obfuscate
        const result = await this.obfuscator.obfuscate(code, options);

        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: 'Obfuscation failed',
            details: result.error
          });
        }

        // Increment usage
        authManager.incrementUsage(req.user.userId);

        res.json({
          success: true,
          data: {
            code: result.code,
            jobId: result.jobId,
            stats: result.stats
          },
          usage: {
            hourly: req.user.usage.hourly + 1,
            limit: config.tiers[req.user.tier].rateLimitPerHour
          }
        });

      } catch (error) {
        console.error('[API] Obfuscation error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    });

    // Validate endpoint
    this.app.post('/api/validate', this.authMiddleware.bind(this), async (req, res) => {
      try {
        const { code } = req.body;

        if (!code) {
          return res.status(400).json({
            success: false,
            error: 'No code provided'
          });
        }

        const validation = await this.obfuscator.validateLuaCode(code);

        res.json({
          success: true,
          valid: validation.valid,
          error: validation.error || null
        });

      } catch (error) {
        console.error('[API] Validation error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    });

    // Account info endpoint
    this.app.get('/api/account', this.authMiddleware.bind(this), (req, res) => {
      const tierConfig = config.tiers[req.user.tier];

      res.json({
        success: true,
        data: {
          userId: req.user.userId,
          tier: req.user.tier,
          usage: req.user.usage,
          limits: {
            rateLimitPerHour: tierConfig.rateLimitPerHour,
            maxFileSize: tierConfig.maxFileSize
          },
          features: tierConfig.features,
          createdAt: req.user.createdAt
        }
      });
    });

    // Usage statistics
    this.app.get('/api/usage', this.authMiddleware.bind(this), (req, res) => {
      res.json({
        success: true,
        data: {
          hourly: req.user.usage.hourly,
          daily: req.user.usage.daily,
          total: req.user.usage.total,
          limit: config.tiers[req.user.tier].rateLimitPerHour,
          resetAt: new Date(req.user.usage.lastReset.getTime() + 3600000).toISOString()
        }
      });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      console.error('[API] Error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    });
  }

  authMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required'
      });
    }

    const user = authManager.getUserByApiKey(apiKey);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    // Check rate limit
    if (!authManager.checkRateLimit(user.userId)) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        limit: config.tiers[user.tier].rateLimitPerHour,
        resetAt: new Date(user.usage.lastReset.getTime() + 3600000).toISOString()
      });
    }

    req.user = user;
    next();
  }

  async start() {
    await this.obfuscator.initialize();

    this.server = this.app.listen(config.api.port, () => {
      console.log(`[API] Server running on port ${config.api.port}`);
      console.log(`[API] Health check: http://localhost:${config.api.port}/health`);
    });
  }

  async stop() {
    if (this.server) {
      this.server.close();
      console.log('[API] Server stopped');
    }
  }
}

// Run API if called directly
if (require.main === module) {
  const api = new ObfuscatorAPI();
  api.start();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n[API] Shutting down...');
    await api.stop();
    process.exit(0);
  });
}

module.exports = ObfuscatorAPI;
