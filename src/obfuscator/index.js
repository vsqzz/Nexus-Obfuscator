const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class LuaObfuscator {
  constructor(options = {}) {
    const SRC_ROOT = path.resolve(__dirname, '..');

    this.tempDir = options.tempDir || path.join(SRC_ROOT, 'temp');
    this.obfuscatorPath = path.join(
      SRC_ROOT,
      'obfuscator',
      'obfuscator.lua'
    );

    console.log('[DEBUG] __dirname =', __dirname);
    console.log('[DEBUG] SRC_ROOT =', SRC_ROOT);
    console.log('[DEBUG] obfuscatorPath =', this.obfuscatorPath);
  }

  async initialize() {
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  async obfuscate(luaCode) {
    const jobId = uuidv4();
    const inputFile = path.join(this.tempDir, `input_${jobId}.lua`);
    const outputFile = path.join(this.tempDir, `output_${jobId}.lua`);

    try {
      await fs.writeFile(inputFile, luaCode, 'utf8');
      await this.runObfuscator(inputFile, outputFile);

      const obfuscatedCode = await fs.readFile(outputFile, 'utf8');
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
    } catch (err) {
      await this.cleanup(inputFile, outputFile);
      return {
        success: false,
        error: err.message,
        jobId
      };
    }
  }

  runObfuscator(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
      const luaExe = 'C:\\Users\\kai\\Desktop\\lua\\lua54.exe';

      const absInput = path.resolve(inputFile);
      const absOutput = path.resolve(outputFile);
      const absObfuscator = path.resolve(this.obfuscatorPath);

      console.log('[DEBUG] Lua exe:', luaExe);
      console.log('[DEBUG] Obfuscator:', absObfuscator);
      console.log('[DEBUG] Input:', absInput);
      console.log('[DEBUG] Output:', absOutput);

      const proc = spawn(
        luaExe,
        [absObfuscator, absInput, absOutput],
        { windowsHide: true }
      );

      let stderr = '';
      let stdout = '';

      proc.stdout.on('data', d => stdout += d.toString());
      proc.stderr.on('data', d => stderr += d.toString());

      proc.on('error', err => {
        reject(new Error(`Failed to start Lua: ${err.message}`));
      });

      proc.on('close', code => {
        if (code !== 0) {
          reject(new Error(stderr || stdout || `Lua exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }

  async validateLuaCode(code) {
    const tempFile = path.join(this.tempDir, `validate_${uuidv4()}.lua`);
    await fs.writeFile(tempFile, code, 'utf8');

    return new Promise(resolve => {
      const proc = spawn('luac', ['-p', tempFile], { windowsHide: true });

      let stderr = '';

      proc.stderr.on('data', d => stderr += d.toString());

      proc.on('close', code => {
        fs.unlink(tempFile).catch(() => {});
        resolve(
          code === 0
            ? { valid: true }
            : { valid: false, error: stderr.trim() }
        );
      });
    });
  }

  async cleanup(...files) {
    for (const file of files) {
      await fs.unlink(file).catch(() => {});
    }
  }
}

module.exports = LuaObfuscator;
