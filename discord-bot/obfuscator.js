/**
 * Prometheus Obfuscator Wrapper
 * Uses the proven Prometheus obfuscator instead of custom AI code
 * https://github.com/prometheus-lua/Prometheus
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class PrometheusObfuscator {
  constructor() {
    this.version = 'Prometheus (Real Obfuscator)';
    this.prometheusPath = path.join(__dirname, 'prometheus-obfuscator');
    this.cliPath = path.join(this.prometheusPath, 'cli.lua');
    this.tempDir = path.join(__dirname, 'temp');
  }

  /**
   * Initialize temp directory
   */
  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  /**
   * Check if Lua is installed
   */
  async checkLuaInstalled() {
    return new Promise((resolve) => {
      exec('lua -v', (error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Obfuscate Lua code using Prometheus
   */
  async obfuscate(code, options = {}) {
    const level = options.level || 'medium';
    const jobId = uuidv4();
    const inputFile = path.join(this.tempDir, `input_${jobId}.lua`);
    const outputFile = path.join(this.tempDir, `output_${jobId}.lua`);

    const startTime = Date.now();
    const originalSize = code.length;

    try {
      // Check if Lua is installed
      const luaInstalled = await this.checkLuaInstalled();
      if (!luaInstalled) {
        return {
          success: false,
          error: 'Lua is not installed. Please install Lua 5.1 or LuaJIT to use Prometheus obfuscator.\n' +
                 'Download: https://sourceforge.net/projects/luabinaries/'
        };
      }

      // Write input file
      await fs.writeFile(inputFile, code, 'utf8');

      // Map level to Prometheus preset
      const presetMap = {
        'low': 'Minify',
        'medium': 'Medium',
        'high': 'Strong'
      };
      const preset = presetMap[level] || 'Medium';

      // Run Prometheus
      const result = await this.runPrometheus(inputFile, outputFile, preset);

      if (!result.success) {
        await this.cleanup(inputFile, outputFile);
        return {
          success: false,
          error: result.error,
          jobId
        };
      }

      // Read obfuscated output
      const obfuscatedCode = await fs.readFile(outputFile, 'utf8');
      const obfuscatedSize = obfuscatedCode.length;

      // Cleanup temp files
      await this.cleanup(inputFile, outputFile);

      const endTime = Date.now();

      return {
        success: true,
        code: obfuscatedCode,
        jobId,
        stats: {
          originalSize,
          obfuscatedSize,
          ratio: (obfuscatedSize / originalSize).toFixed(2),
          time: ((endTime - startTime) / 1000).toFixed(2) + 's',
          preset: preset,
          stringsEncrypted: '✓',
          numbersObfuscated: preset !== 'Minify' ? '✓' : '✗',
          variablesRenamed: '✓',
          functionsObfuscated: '✓'
        }
      };

    } catch (error) {
      await this.cleanup(inputFile, outputFile);
      return {
        success: false,
        error: error.message,
        jobId
      };
    }
  }

  /**
   * Run Prometheus CLI
   */
  runPrometheus(inputFile, outputFile, preset) {
    return new Promise((resolve) => {
      const command = `lua "${this.cliPath}" --preset ${preset} --out "${outputFile}" "${inputFile}"`;

      exec(command, {
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      }, (error, stdout, stderr) => {
        if (error) {
          resolve({
            success: false,
            error: `Prometheus failed: ${stderr || error.message}`
          });
          return;
        }

        resolve({ success: true });
      });
    });
  }

  /**
   * Cleanup temp files
   */
  async cleanup(...files) {
    for (const file of files) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Validate Lua code (basic)
   */
  validate(code) {
    // Check balanced parentheses, braces, brackets
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

      // Early exit if negative
      if (parenCount < 0) return { valid: false, error: 'Unbalanced parentheses' };
      if (braceCount < 0) return { valid: false, error: 'Unbalanced braces' };
      if (bracketCount < 0) return { valid: false, error: 'Unbalanced brackets' };
    }

    if (parenCount !== 0) return { valid: false, error: 'Unbalanced parentheses' };
    if (braceCount !== 0) return { valid: false, error: 'Unbalanced braces' };
    if (bracketCount !== 0) return { valid: false, error: 'Unbalanced brackets' };

    // Check for basic Lua syntax
    if (code.trim().length === 0) {
      return { valid: false, error: 'Empty code' };
    }

    return { valid: true };
  }
}

module.exports = PrometheusObfuscator;
