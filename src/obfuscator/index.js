const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const LuauObfuscatorEngine = require('./luau-obfuscator');

class LuaObfuscator {
  constructor(options = {}) {
    this.tempDir = options.tempDir || path.join(__dirname, '../../temp');
    this.luauEngine = new LuauObfuscatorEngine();
  }

  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('[OBFUSCATOR] Error creating temp directory:', error);
    }
  }

  async obfuscate(luaCode, options = {}) {
    const jobId = uuidv4();
    const type = options.type || 'luau';
    const level = options.level || 'medium';

    try {
      let obfuscatedCode;

      if (type === 'luau') {
        // Use JavaScript-based Luau obfuscator (no Lua required!)
        obfuscatedCode = this.luauEngine.obfuscate(luaCode, { level });
      } else {
        // Standard Lua obfuscation not supported without Lua installation
        return {
          success: false,
          error: 'Standard Lua obfuscation requires Lua to be installed. Please use Luau (Roblox) type instead.',
          jobId
        };
      }

      return {
        success: true,
        code: obfuscatedCode,
        jobId,
        stats: {
          originalSize: luaCode.length,
          obfuscatedSize: obfuscatedCode.length,
          ratio: (obfuscatedCode.length / luaCode.length).toFixed(2),
          type: type,
          level: level
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        jobId
      };
    }
  }

  async validateLuaCode(code) {
    // Basic syntax validation
    const checks = [
      { pattern: /\bthen\s*$/m, error: 'Incomplete if/elseif statement' },
      { pattern: /\bdo\s*$/m, error: 'Incomplete do block' },
      { pattern: /\bfunction\s*$/m, error: 'Incomplete function declaration' },
    ];

    for (const check of checks) {
      if (check.pattern.test(code)) {
        return {
          valid: false,
          error: check.error
        };
      }
    }

    // Check balanced parentheses, brackets, braces
    let parenCount = 0;
    let braceCount = 0;
    let bracketCount = 0;

    for (let char of code) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;
    }

    if (parenCount !== 0) {
      return { valid: false, error: 'Unbalanced parentheses' };
    }
    if (braceCount !== 0) {
      return { valid: false, error: 'Unbalanced braces' };
    }
    if (bracketCount !== 0) {
      return { valid: false, error: 'Unbalanced brackets' };
    }

    // Check for common Lua/Roblox code
    const hasLuaCode = /\b(local|function|if|then|end|for|while|do)\b/.test(code);

    if (!hasLuaCode && code.length > 10) {
      return {
        valid: false,
        error: 'Code does not appear to be valid Lua/Luau'
      };
    }

    return { valid: true };
  }

  async cleanup(...files) {
    for (const file of files) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
}

module.exports = LuaObfuscator;
