const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class LuauObfuscator {
  constructor(options = {}) {
    this.tempDir = options.tempDir || path.join(__dirname, '../../temp');
    this.luauObfuscatorPath = path.join(__dirname, 'obfuscator_luau.lua');
  }

  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async obfuscate(luaCode, options = {}) {
    const jobId = uuidv4();
    const inputFile = path.join(this.tempDir, `input_${jobId}.lua`);
    const outputFile = path.join(this.tempDir, `output_${jobId}.lua`);
    const level = options.level || 'medium'; // low, medium, high

    try {
      // Write input code to temp file
      await fs.writeFile(inputFile, luaCode, 'utf8');

      // Run the Luau obfuscator
      await this.runObfuscator(inputFile, outputFile, level);

      // Read the obfuscated output
      const obfuscatedCode = await fs.readFile(outputFile, 'utf8');

      // Cleanup temp files
      await this.cleanup(inputFile, outputFile);

      return {
        success: true,
        code: obfuscatedCode,
        jobId,
        stats: {
          originalSize: luaCode.length,
          obfuscatedSize: obfuscatedCode.length,
          ratio: (obfuscatedCode.length / luaCode.length).toFixed(2),
          level: level
        }
      };
    } catch (error) {
      // Cleanup on error
      await this.cleanup(inputFile, outputFile);

      return {
        success: false,
        error: error.message,
        jobId
      };
    }
  }

  runObfuscator(inputFile, outputFile, level) {
    return new Promise((resolve, reject) => {
      const command = `lua "${this.luauObfuscatorPath}" "${inputFile}" "${outputFile}" "${level}"`;

      exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Obfuscation failed: ${stderr || error.message}`));
          return;
        }
        resolve(stdout);
      });
    });
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

  async validateLuaCode(code) {
    // Basic syntax validation for Luau
    // Check for common syntax errors
    const checks = [
      { pattern: /\bthen\s*$/, error: 'Incomplete if/elseif statement' },
      { pattern: /\bdo\s*$/, error: 'Incomplete do block' },
      { pattern: /\bfunction\s*$/, error: 'Incomplete function declaration' },
    ];

    for (const check of checks) {
      if (check.pattern.test(code)) {
        return {
          valid: false,
          error: check.error
        };
      }
    }

    // Check balanced parentheses
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

    return { valid: true };
  }
}

module.exports = LuauObfuscator;
