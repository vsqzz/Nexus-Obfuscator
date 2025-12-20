/**
 * Nexus Obfuscator - Luau/Roblox Edition (Pure JavaScript)
 * No Lua installation required!
 */

class LuauObfuscator {
  constructor() {
    this.seed = Date.now();
  }

  // Generate random variable name
  randomVar(seed) {
    const chars = ['l', 'I', 'i', 'L', 'O', 'o', '0', '_', 'Il', 'lI', 'll', 'II'];
    const length = 8 + Math.floor(Math.random() * 8);
    let name = chars[Math.floor(Math.random() * 4)]; // First char must be letter

    for (let i = 1; i < length; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }

    return name;
  }

  // XOR encrypt a string
  encryptString(str) {
    const key = Math.floor(Math.random() * 255) + 1;
    const encrypted = [];

    for (let i = 0; i < str.length; i++) {
      encrypted.push(str.charCodeAt(i) ^ key);
    }

    return { encrypted, key };
  }

  // Generate string decryptor code
  generateStringDecryptor(encrypted, key) {
    const bytes = encrypted.join(',');
    return `(function() local t={${bytes}} local s='' for i=1,#t do s=s..string.char(t[i]~${key}) end return s end)()`;
  }

  // Obfuscate a number
  obfuscateNumber(num) {
    const methods = [
      // Method 1: Addition/Subtraction
      (n) => {
        const a = Math.floor(Math.random() * 100) + 1;
        const b = Math.floor(Math.random() * 100) + 1;
        return `((${n + b}+${a})-${a + b})`;
      },
      // Method 2: Multiplication/Division
      (n) => {
        const div = Math.floor(Math.random() * 9) + 2;
        return `(${n * div}/${div})`;
      },
      // Method 3: XOR
      (n) => {
        const key = Math.floor(Math.random() * 255) + 1;
        return `(${n}~${key}~${key})`;
      },
      // Method 4: Bit operations
      (n) => {
        const shift = Math.floor(Math.random() * 3) + 1;
        return `(${n << shift}>>${shift})`;
      }
    ];

    return methods[Math.floor(Math.random() * methods.length)](num);
  }

  // Main obfuscation function
  obfuscate(code, options = {}) {
    const level = options.level || 'medium';
    let output = [];

    // Add header
    output.push('-- Obfuscated by Nexus Obfuscator v2.0');
    output.push('-- https://github.com/vsqzz/Nexus-Obfuscator');
    output.push('');

    let processedCode = code;

    // Stage 1: String encryption
    // Handle double-quoted strings
    processedCode = processedCode.replace(/"([^"]*)"/g, (match, str) => {
      if (str === '') return '""';

      const { encrypted, key } = this.encryptString(str);
      return this.generateStringDecryptor(encrypted, key);
    });

    // Handle single-quoted strings
    processedCode = processedCode.replace(/'([^']*)'/g, (match, str) => {
      if (str === '') return "''";

      const { encrypted, key } = this.encryptString(str);
      return this.generateStringDecryptor(encrypted, key);
    });

    // Handle multiline strings [[...]]
    processedCode = processedCode.replace(/\[\[([^\]]*)\]\]/g, (match, str) => {
      if (str === '') return '[[]]';

      const { encrypted, key } = this.encryptString(str);
      return this.generateStringDecryptor(encrypted, key);
    });

    // Stage 2: Number obfuscation (medium/high only)
    if (level === 'medium' || level === 'high') {
      processedCode = processedCode.replace(/\b(\d+)\b/g, (match, num) => {
        const n = parseInt(num);
        if (n > 0 && n < 1000) {
          return this.obfuscateNumber(n);
        }
        return match;
      });
    }

    // Stage 3: Variable renaming (high only)
    if (level === 'high') {
      const varMap = new Map();
      let varCounter = 0;

      // Find and rename local variables
      processedCode = processedCode.replace(/local\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, varName) => {
        // Don't rename Roblox globals
        const robloxGlobals = ['game', 'workspace', 'script', 'player', 'Character', 'Humanoid'];
        if (robloxGlobals.includes(varName)) {
          return match;
        }

        if (!varMap.has(varName)) {
          varMap.set(varName, this.randomVar(varCounter++));
        }
        return 'local ' + varMap.get(varName);
      });

      // Replace variable usages
      varMap.forEach((obfName, origName) => {
        const regex = new RegExp(`\\b${origName}\\b`, 'g');
        processedCode = processedCode.replace(regex, obfName);
      });
    }

    // Stage 4: Add junk code (high only)
    if (level === 'high') {
      const junkVars = [
        `local ${this.randomVar(9999)} = ${this.obfuscateNumber(Math.floor(Math.random() * 100))}`,
        `local ${this.randomVar(8888)} = function() return nil end`,
        `local ${this.randomVar(7777)} = "${Math.random().toString(36).substring(7)}"`
      ];

      output.push(junkVars[Math.floor(Math.random() * junkVars.length)]);
      output.push('');
    }

    output.push(processedCode);

    return output.join('\n');
  }
}

module.exports = LuauObfuscator;
