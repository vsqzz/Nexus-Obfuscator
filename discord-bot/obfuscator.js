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
    this.luaCommand = 'lua'; // Will be updated when checkLuaInstalled() runs
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
   * Check if Lua is installed and find which command works
   */
  async checkLuaInstalled() {
    const luaCommands = ['lua', 'lua5.1', 'lua51', 'lua5', 'luajit'];

    for (const cmd of luaCommands) {
      const works = await new Promise((resolve) => {
        exec(`${cmd} -v`, { timeout: 5000 }, (error) => {
          resolve(!error);
        });
      });

      if (works) {
        this.luaCommand = cmd;
        console.log(`[Obfuscator] Found working Lua command: ${cmd}`);
        return true;
      }
    }

    console.error('[Obfuscator] No Lua command found. Tried:', luaCommands.join(', '));
    return false;
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
          error: 'Lua is not installed or not in PATH.\n\n' +
                 'Tried commands: lua, lua5.1, lua51, lua5, luajit\n\n' +
                 'Solutions:\n' +
                 '1. Rename lua5.1.exe to lua.exe in C:\\Users\\kai\\Desktop\\lua\n' +
                 '2. Or download Lua: https://sourceforge.net/projects/luabinaries/'
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
      let obfuscatedCode = await fs.readFile(outputFile, 'utf8');

      // Add Nexus header
      const nexusHeader = `--[[\n` +
        `    Obfuscated by Nexus Obfuscator\n` +
        `    https://github.com/vsqzz/Nexus-Obfuscator\n` +
        `    \n` +
        `    Powered by Prometheus\n` +
        `    Date: ${new Date().toLocaleString()}\n` +
        `]]\n\n`;

      obfuscatedCode = nexusHeader + obfuscatedCode;
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
      const command = `${this.luaCommand} "${this.cliPath}" --preset ${preset} --out "${outputFile}" "${inputFile}"`;

      console.log(`[Obfuscator] Running: ${command}`);

      exec(command, {
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        cwd: this.prometheusPath // Run from Prometheus directory
      }, async (error, stdout, stderr) => {
        if (error) {
          console.error('[Obfuscator] Error:', error.message);
          console.error('[Obfuscator] Stderr:', stderr);
          console.error('[Obfuscator] Stdout:', stdout);

          resolve({
            success: false,
            error: `Prometheus CLI failed:\n${stderr || stdout || error.message}\n\nCommand: ${command}`
          });
          return;
        }

        console.log('[Obfuscator] Success!');
        if (stdout) console.log('[Obfuscator] Output:', stdout);

        // Check if output file was actually created
        try {
          const fs = require('fs');
          if (!fs.existsSync(outputFile)) {
            console.error('[Obfuscator] Output file not found:', outputFile);
            resolve({
              success: false,
              error: `Prometheus succeeded but output file not found: ${outputFile}`
            });
            return;
          }
          console.log('[Obfuscator] Output file confirmed:', outputFile);
        } catch (checkError) {
          console.error('[Obfuscator] Error checking output file:', checkError);
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
