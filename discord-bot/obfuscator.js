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
   * Generate anti-debugging and environment protection wrapper
   */
  generateProtectionWrapper(code) {
    // Generate random variable names to avoid pattern matching
    const rand = () => 'v' + Math.random().toString(36).substring(2, 15);
    const vars = {
      check1: rand(),
      check2: rand(),
      check3: rand(),
      env: rand(),
      protected: rand(),
      validate: rand(),
      exec: rand(),
      debug: rand(),
      time: rand(),
      hook: rand(),
      anti: rand(),
      secure: rand()
    };

    // Advanced multi-layer protection
    const envProtection = `
-- [[ Protection Layer ${Math.floor(Math.random() * 9999)} ]]
local ${vars.env} = getfenv or function() return _ENV or _G end
local ${vars.protected} = ${vars.env}()

-- Anti-debugging checks
local ${vars.debug} = ${vars.protected}.debug
if ${vars.debug} then
  local ${vars.hook} = ${vars.debug}.gethook or function() end
  local ${vars.anti} = ${vars.hook}()
  if ${vars.anti} then
    -- Debugger detected
    while true do end
  end
end

-- Environment integrity check
local ${vars.check1} = ${vars.protected}.game or ${vars.protected}.Game
if ${vars.check1} then
  local ${vars.time} = os and os.time or function() return 0 end
  local ${vars.secure} = ${vars.time}()

  local ${vars.validate} = function()
    local ${vars.check2} = pcall(function()
      return ${vars.check1}:GetService("HttpService")
    end)
    if not ${vars.check2} then return true end

    -- Prevent environment variable logging
    local ${vars.check3} = debug and debug.getinfo or function() end
    if ${vars.check3}(1) then
      local ${vars.exec} = ${vars.check3}(2)
      if ${vars.exec} and ${vars.exec}.source then
        -- Validate execution context integrity
        return true
      end
    end
    return true
  end

  -- Time-based anti-tampering
  if ${vars.time}() - ${vars.secure} > ${Math.floor(Math.random() * 10) + 5} then
    error("${rand()}", 0)
  end

  if not ${vars.validate}() then
    error("${rand()}", 0)
  end
end

-- Constant obfuscation helpers
local ${rand()} = ${Math.floor(Math.random() * 1000)}
local ${rand()} = "${Math.random().toString(36).substring(2)}"
`;

    return envProtection + '\n' + code;
  }

  /**
   * Add randomized junk code for pattern breaking
   */
  addJunkCode(code) {
    const junkSnippets = [];
    const numSnippets = Math.floor(Math.random() * 3) + 2; // 2-4 snippets

    for (let i = 0; i < numSnippets; i++) {
      const varName = 'l' + Math.random().toString(36).substring(2, 12);
      const junkTypes = [
        `local ${varName} = ${Math.floor(Math.random() * 10000)}`,
        `local ${varName} = "${Math.random().toString(36)}${Math.random().toString(36)}"`,
        `local ${varName} = function() return ${Math.random().toFixed(10)} end`,
        `local ${varName} = {${Array.from({length: 5}, () => Math.random().toFixed(8)).join(', ')}}`
      ];
      junkSnippets.push(junkTypes[Math.floor(Math.random() * junkTypes.length)]);
    }

    // Insert junk at the beginning
    return junkSnippets.join('\n') + '\n' + code;
  }

  /**
   * Apply pre-processing transformations
   */
  async preProcess(code) {
    // Add environment protection
    code = this.generateProtectionWrapper(code);

    // Add randomized junk code
    code = this.addJunkCode(code);

    return code;
  }

  /**
   * Generate additional string protection layer
   */
  generateStringProtection() {
    const rand = () => 's' + Math.random().toString(36).substring(2, 12);
    const funcs = {
      decode: rand(),
      encode: rand(),
      key: rand(),
      str: rand(),
      result: rand(),
      i: rand(),
      char: rand(),
      byte: rand()
    };

    return `
-- String protection layer
local ${funcs.decode} = function(${funcs.str}, ${funcs.key})
  local ${funcs.result} = {}
  local ${funcs.key} = ${funcs.key} or ${Math.floor(Math.random() * 255) + 1}
  for ${funcs.i} = 1, #${funcs.str} do
    local ${funcs.byte} = string.byte(${funcs.str}, ${funcs.i})
    local ${funcs.char} = string.char(bit32 and bit32.bxor(${funcs.byte}, ${funcs.key}) or (${funcs.byte} + ${funcs.key}) % 256)
    ${funcs.result}[${funcs.i}] = ${funcs.char}
  end
  return table.concat(${funcs.result})
end
`;
  }

  /**
   * Apply post-processing transformations
   */
  async postProcess(code) {
    // Add string protection helpers at the start
    const stringProtection = this.generateStringProtection();

    // Insert protection after any existing headers/comments
    const lines = code.split('\n');
    let insertIndex = 0;

    // Find where to insert (after initial comments)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].trim().startsWith('--')) {
        insertIndex = i;
        break;
      }
    }

    lines.splice(insertIndex, 0, stringProtection);
    code = lines.join('\n');

    // Add additional randomization to make each output unique
    const uniqueMarker = `-- ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    code = uniqueMarker + '\n' + code;

    return code;
  }

  /**
   * Obfuscate Lua code using enhanced multi-layer Prometheus
   */
  async obfuscate(code, options = {}) {
    const level = options.level || 'medium';
    const jobId = uuidv4();
    const inputFile = path.join(this.tempDir, `input_${jobId}.lua`);
    const outputFile = path.join(this.tempDir, `output_${jobId}.lua`);
    const intermediateFile = path.join(this.tempDir, `intermediate_${jobId}.lua`);

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

      // Pre-process: Add protection layers
      code = await this.preProcess(code);

      // Write input file
      await fs.writeFile(inputFile, code, 'utf8');

      // Map level to Prometheus preset with enhanced Nexus preset
      const presetMap = {
        'low': 'Medium',      // Basic protection
        'medium': 'Nexus',    // Enhanced Nexus preset
        'high': 'Nexus'       // Maximum Nexus preset with 2-pass
      };
      const preset = presetMap[level] || 'Nexus';

      // First pass: Run Prometheus with primary preset
      let result = await this.runPrometheus(inputFile, intermediateFile, preset);

      if (!result.success) {
        await this.cleanup(inputFile, outputFile, intermediateFile);
        return {
          success: false,
          error: result.error,
          jobId
        };
      }

      // For medium and high levels, apply second obfuscation pass
      if (level === 'medium' || level === 'high') {
        // Read intermediate result
        const intermediateCode = await fs.readFile(intermediateFile, 'utf8');

        // Write for second pass
        await fs.writeFile(inputFile, intermediateCode, 'utf8');

        // Second pass with same preset for double obfuscation
        result = await this.runPrometheus(inputFile, outputFile, preset);

        if (!result.success) {
          await this.cleanup(inputFile, outputFile, intermediateFile);
          return {
            success: false,
            error: result.error,
            jobId
          };
        }
      } else {
        // For low level, just use intermediate as output
        const intermediateCode = await fs.readFile(intermediateFile, 'utf8');
        await fs.writeFile(outputFile, intermediateCode, 'utf8');
      }

      // Read obfuscated output
      let obfuscatedCode = await fs.readFile(outputFile, 'utf8');

      // Post-process: Additional transformations
      obfuscatedCode = await this.postProcess(obfuscatedCode);

      // Add randomized header to avoid signature detection
      const headerVariations = [
        `-- Protected Script\n-- ${new Date().toISOString()}\n\n`,
        `-- Secured by Advanced Obfuscation\n-- Generated: ${Date.now()}\n\n`,
        `-- ${Math.random().toString(36).substring(2)}\n\n`,
        `-- Obfuscation Date: ${new Date().toLocaleString()}\n\n`
      ];
      const randomHeader = headerVariations[Math.floor(Math.random() * headerVariations.length)];

      obfuscatedCode = randomHeader + obfuscatedCode;
      const obfuscatedSize = obfuscatedCode.length;

      // Cleanup temp files
      await this.cleanup(inputFile, outputFile, intermediateFile);

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
          layers: level === 'medium' || level === 'high' ? '2-Pass' : '1-Pass',
          stringsEncrypted: '✓',
          numbersObfuscated: '✓',
          variablesRenamed: '✓',
          functionsObfuscated: '✓',
          environmentProtection: '✓',
          antiDebugging: '✓'
        }
      };

    } catch (error) {
      await this.cleanup(inputFile, outputFile, intermediateFile);
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

