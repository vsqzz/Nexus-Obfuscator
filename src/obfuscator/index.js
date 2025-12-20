const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class LuaObfuscator {
  constructor(options = {}) {
    this.tempDir = options.tempDir || path.join(__dirname, '../../temp');
    this.obfuscatorPath = path.join(__dirname, '../../obfuscator.lua');
    this.templatePath = path.join(__dirname, '../../template.out');
    this.minifyPath = path.join(__dirname, '../../minify.js');
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
    const outputFile = path.join(this.tempDir, `output_${jobId}.txt`);

    try {
      // Write input code to temp file
      await fs.writeFile(inputFile, luaCode, 'utf8');

      // Run the obfuscator
      await this.runObfuscator(inputFile, outputFile);

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
          ratio: (obfuscatedCode.length / luaCode.length).toFixed(2)
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

  runObfuscator(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
      // Create a modified version of the obfuscator that accepts parameters
      const command = `lua ${this.obfuscatorPath} ${inputFile} ${outputFile}`;

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
    const tempFile = path.join(this.tempDir, `validate_${uuidv4()}.lua`);

    try {
      await fs.writeFile(tempFile, code, 'utf8');

      return new Promise((resolve) => {
        exec(`luac -p ${tempFile}`, (error, stdout, stderr) => {
          fs.unlink(tempFile).catch(() => {});

          if (error) {
            resolve({
              valid: false,
              error: stderr || error.message
            });
          } else {
            resolve({ valid: true });
          }
        });
      });
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = LuaObfuscator;
