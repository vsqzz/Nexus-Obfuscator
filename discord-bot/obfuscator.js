/**
 * Luau Obfuscator Engine
 * Pure JavaScript obfuscator for Roblox/Luau scripts
 */

class LuauObfuscator {
  constructor() {
    this.version = '2.0';
  }

  /**
   * XOR encrypt a string
   */
  encryptString(str) {
    const key = Math.floor(Math.random() * 255) + 1;
    const encrypted = [];

    for (let i = 0; i < str.length; i++) {
      encrypted.push(str.charCodeAt(i) ^ key);
    }

    return { encrypted, key };
  }

  /**
   * Generate string decryptor code
   */
  generateStringDecryptor(encrypted, key) {
    const bytes = encrypted.join(',');
    return `(function() local t={${bytes}} local s='' for i=1,#t do s=s..string.char(t[i]~${key}) end return s end)()`;
  }

  /**
   * Obfuscate a number using various methods
   */
  obfuscateNumber(num) {
    const methods = [
      // Addition/Subtraction
      () => {
        const offset = Math.floor(Math.random() * 200) + 50;
        return `((${num + offset})-${offset})`;
      },
      // Multiplication/Division
      () => {
        const factor = Math.floor(Math.random() * 5) + 2;
        return `(${num * factor}/${factor})`;
      },
      // XOR
      () => {
        const mask = Math.floor(Math.random() * 200) + 1;
        return `(${num ^ mask}~${mask}~${mask})`;
      },
      // Bit shift
      () => {
        const shift = Math.floor(Math.random() * 3) + 1;
        return `(${num << shift}>>${shift})`;
      }
    ];

    return methods[Math.floor(Math.random() * methods.length)]();
  }

  /**
   * Generate random variable name
   */
  generateVarName(length = 8) {
    const chars = 'IlO0oLiILOol_';
    let name = chars[Math.floor(Math.random() * 10)]; // First char can't be number

    for (let i = 1; i < length; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }

    return name;
  }

  /**
   * Main obfuscation function
   */
  obfuscate(code, options = {}) {
    const level = options.level || 'medium';
    let obfuscated = code;
    const stats = {
      originalSize: code.length,
      stringsEncrypted: 0,
      numbersObfuscated: 0,
      variablesRenamed: 0
    };

    // Add header
    const header = `-- Obfuscated by Nexus Obfuscator v${this.version}\n-- https://github.com/vsqzz/Nexus-Obfuscator\n\n`;

    // Stage 1: Encrypt strings (ALL LEVELS)
    obfuscated = obfuscated.replace(/"([^"]*)"/g, (match, str) => {
      if (str.length === 0) return match;
      stats.stringsEncrypted++;
      const { encrypted, key } = this.encryptString(str);
      return this.generateStringDecryptor(encrypted, key);
    });

    obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
      if (str.length === 0) return match;
      stats.stringsEncrypted++;
      const { encrypted, key } = this.encryptString(str);
      return this.generateStringDecryptor(encrypted, key);
    });

    // Stage 2: Obfuscate numbers (MEDIUM & HIGH)
    if (level === 'medium' || level === 'high') {
      obfuscated = obfuscated.replace(/\b(\d+)\b/g, (match, num) => {
        if (parseInt(num) === 0) return num; // Keep 0 as is
        stats.numbersObfuscated++;
        return this.obfuscateNumber(parseInt(num));
      });
    }

    // Stage 3: Variable renaming (HIGH ONLY)
    if (level === 'high') {
      const varPattern = /\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
      const variables = new Map();

      obfuscated = obfuscated.replace(varPattern, (match, varName) => {
        if (!variables.has(varName)) {
          variables.set(varName, this.generateVarName());
          stats.variablesRenamed++;
        }
        return `local ${variables.get(varName)} =`;
      });

      // Replace variable usage
      variables.forEach((newName, oldName) => {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        obfuscated = obfuscated.replace(regex, newName);
      });

      // Add junk code
      const junkVars = [];
      for (let i = 0; i < 3; i++) {
        junkVars.push(`local ${this.generateVarName()} = ${Math.floor(Math.random() * 100)}`);
      }
      obfuscated = junkVars.join('\n') + '\n\n' + obfuscated;
    }

    stats.obfuscatedSize = header.length + obfuscated.length;
    stats.ratio = (stats.obfuscatedSize / stats.originalSize).toFixed(2);

    return {
      success: true,
      code: header + obfuscated,
      stats
    };
  }

  /**
   * Validate Lua code (basic)
   */
  validate(code) {
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

    if (parenCount !== 0) return { valid: false, error: 'Unbalanced parentheses' };
    if (braceCount !== 0) return { valid: false, error: 'Unbalanced braces' };
    if (bracketCount !== 0) return { valid: false, error: 'Unbalanced brackets' };

    return { valid: true };
  }
}

module.exports = LuauObfuscator;
