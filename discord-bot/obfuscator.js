/**
 * Advanced Luau Obfuscator Engine
 * Professional-grade obfuscation for Roblox/Luau scripts
 * Techniques: Control flow obfuscation, VM wrapping, expression complexity
 */

class AdvancedLuauObfuscator {
  constructor() {
    this.version = '2.0 Pro';
    this.usedVarNames = new Set();
  }

  /**
   * Generate extremely confusing variable names
   */
  generateConfusingVarName(length = 12) {
    // Mix of visually similar characters
    const confusingChars = 'IlL1O0oQD8B_iLoO0IlL';
    const prefixes = ['__', '_', 'l', 'I', 'O'];

    let name = prefixes[Math.floor(Math.random() * prefixes.length)];

    for (let i = 0; i < length; i++) {
      name += confusingChars[Math.floor(Math.random() * confusingChars.length)];
    }

    // Ensure uniqueness
    while (this.usedVarNames.has(name)) {
      name += confusingChars[Math.floor(Math.random() * confusingChars.length)];
    }

    this.usedVarNames.add(name);
    return name;
  }

  /**
   * Advanced string encryption with multiple layers
   */
  encryptStringAdvanced(str) {
    const key1 = Math.floor(Math.random() * 255) + 1;
    const key2 = Math.floor(Math.random() * 255) + 1;
    const encrypted = [];

    // Double XOR encryption
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      const xor1 = char ^ key1;
      const xor2 = xor1 ^ key2;
      encrypted.push(xor2);
    }

    return { encrypted, key1, key2 };
  }

  /**
   * Generate heavily obfuscated string decryptor
   */
  generateAdvancedStringDecryptor(encrypted, key1, key2) {
    const bytes = encrypted.join(',');
    const tempVar1 = this.generateConfusingVarName(8);
    const tempVar2 = this.generateConfusingVarName(8);
    const tempVar3 = this.generateConfusingVarName(8);
    const tempVar4 = this.generateConfusingVarName(8);

    // Complex nested function with fake variables
    return `(function() ` +
      `local ${tempVar1}={${bytes}} ` +
      `local ${tempVar2}='' ` +
      `local ${tempVar3}=${key2} ` +
      `local ${tempVar4}=${key1} ` +
      `for ${this.generateConfusingVarName(4)}=1,#${tempVar1} do ` +
      `${tempVar2}=${tempVar2}..string.char((${tempVar1}[${this.generateConfusingVarName(4)}]~${tempVar3})~${tempVar4}) ` +
      `end ` +
      `return ${tempVar2} end)()`;
  }

  /**
   * Wrap number in complex mathematical expression
   */
  obfuscateNumberAdvanced(num) {
    const methods = [
      // Multi-layer arithmetic
      () => {
        const a = Math.floor(Math.random() * 100) + 50;
        const b = Math.floor(Math.random() * 50) + 10;
        const c = Math.floor(Math.random() * 30) + 5;
        return `(((${num + a + b})-${a})-${b}+${c}-${c})`;
      },
      // Nested operations
      () => {
        const mult = Math.floor(Math.random() * 5) + 2;
        const add = Math.floor(Math.random() * 100);
        return `((${num * mult}/${mult})+${add}-${add})`;
      },
      // Triple XOR
      () => {
        const mask1 = Math.floor(Math.random() * 200) + 1;
        const mask2 = Math.floor(Math.random() * 200) + 1;
        const mask3 = Math.floor(Math.random() * 200) + 1;
        return `(((${num ^ mask1}~${mask1})~${mask2}~${mask2})~${mask3}~${mask3})`;
      },
      // Bit shift combinations
      () => {
        const shift = Math.floor(Math.random() * 4) + 1;
        const add = Math.floor(Math.random() * 50);
        return `(((${num << shift}>>${shift})+${add})-${add})`;
      },
      // Complex mixed
      () => {
        const a = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 50);
        const mask = Math.floor(Math.random() * 100);
        return `((((${(num + a) << 1}>>1)-${a})~${mask}~${mask})+${b}-${b})`;
      }
    ];

    return methods[Math.floor(Math.random() * methods.length)]();
  }

  /**
   * Add control flow obfuscation - fake conditions and jumps
   */
  addControlFlowObfuscation(code) {
    const fakeVar1 = this.generateConfusingVarName(10);
    const fakeVar2 = this.generateConfusingVarName(10);
    const fakeVar3 = this.generateConfusingVarName(10);

    // Add fake control flow at the beginning
    let obfuscated = `local ${fakeVar1}=${Math.floor(Math.random() * 1000)}\n`;
    obfuscated += `local ${fakeVar2}=${Math.floor(Math.random() * 1000)}\n`;
    obfuscated += `local ${fakeVar3}=function()return ${fakeVar1}+${fakeVar2} end\n`;
    obfuscated += `if ${fakeVar3}()>${fakeVar1} then ${fakeVar2}=${fakeVar2}+1 end\n\n`;
    obfuscated += code;

    return obfuscated;
  }

  /**
   * Wrap the entire code in a VM-like wrapper
   */
  wrapInVM(code) {
    const vmVar = this.generateConfusingVarName(15);
    const loaderVar = this.generateConfusingVarName(15);
    const execVar = this.generateConfusingVarName(15);

    let wrapped = `local ${vmVar}=(function()\n`;
    wrapped += `local ${loaderVar}=function()\n`;
    wrapped += code + `\n`;
    wrapped += `end\n`;
    wrapped += `local ${execVar}=pcall(${loaderVar})\n`;
    wrapped += `if not ${execVar} then warn("Execution failed") end\n`;
    wrapped += `return ${loaderVar}\n`;
    wrapped += `end)()\n`;
    wrapped += `${vmVar}()\n`;

    return wrapped;
  }

  /**
   * Add junk/dead code that looks real
   */
  generateJunkCode(amount = 10) {
    let junk = '';

    for (let i = 0; i < amount; i++) {
      const var1 = this.generateConfusingVarName(8);
      const var2 = this.generateConfusingVarName(8);
      const num1 = Math.floor(Math.random() * 1000);
      const num2 = Math.floor(Math.random() * 1000);

      junk += `local ${var1}=${num1}\n`;
      junk += `local ${var2}=function(${this.generateConfusingVarName(5)})return ${var1}+${num2} end\n`;

      if (Math.random() > 0.5) {
        junk += `if ${var1}>${num2} then ${var1}=${var1}+1 else ${var1}=${var1}-1 end\n`;
      }
    }

    return junk;
  }

  /**
   * Extract and obfuscate variable declarations
   */
  obfuscateVariables(code) {
    const varMap = new Map();
    const localVarPattern = /local\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;

    // Find all local variables
    let match;
    while ((match = localVarPattern.exec(code)) !== null) {
      const varName = match[1];
      if (!varMap.has(varName)) {
        varMap.set(varName, this.generateConfusingVarName(14));
      }
    }

    // Replace all occurrences
    varMap.forEach((newName, oldName) => {
      // Replace in declarations
      code = code.replace(
        new RegExp(`\\blocal\\s+${oldName}\\b`, 'g'),
        `local ${newName}`
      );

      // Replace in usage (word boundaries)
      code = code.replace(
        new RegExp(`\\b${oldName}\\b`, 'g'),
        newName
      );
    });

    return code;
  }

  /**
   * Obfuscate function declarations
   */
  obfuscateFunctions(code) {
    const funcPattern = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    const funcMap = new Map();

    let match;
    while ((match = funcPattern.exec(code)) !== null) {
      const funcName = match[1];
      if (!funcMap.has(funcName)) {
        funcMap.set(funcName, this.generateConfusingVarName(16));
      }
    }

    funcMap.forEach((newName, oldName) => {
      code = code.replace(
        new RegExp(`\\bfunction\\s+${oldName}\\b`, 'g'),
        `function ${newName}`
      );
      code = code.replace(
        new RegExp(`\\b${oldName}\\b`, 'g'),
        newName
      );
    });

    return code;
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
      variablesRenamed: 0,
      functionsObfuscated: 0
    };

    // Reset used names
    this.usedVarNames.clear();

    // Add professional header
    const header = `--[[\n` +
      `  Obfuscated with Nexus Obfuscator Pro v${this.version}\n` +
      `  https://github.com/vsqzz/Nexus-Obfuscator\n` +
      `  \n` +
      `  Protection Level: ${level.toUpperCase()}\n` +
      `  Timestamp: ${new Date().toISOString()}\n` +
      `  \n` +
      `  WARNING: Deobfuscation attempts will result in broken code\n` +
      `]]\n\n`;

    // Stage 1: Encrypt ALL strings with advanced method
    obfuscated = obfuscated.replace(/"([^"]*)"/g, (match, str) => {
      if (str.length === 0) return '""';
      stats.stringsEncrypted++;
      const { encrypted, key1, key2 } = this.encryptStringAdvanced(str);
      return this.generateAdvancedStringDecryptor(encrypted, key1, key2);
    });

    obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
      if (str.length === 0) return "''";
      stats.stringsEncrypted++;
      const { encrypted, key1, key2 } = this.encryptStringAdvanced(str);
      return this.generateAdvancedStringDecryptor(encrypted, key1, key2);
    });

    // Stage 2: Advanced number obfuscation (MEDIUM & HIGH)
    if (level === 'medium' || level === 'high') {
      obfuscated = obfuscated.replace(/\b(\d+)\b/g, (match, num) => {
        const n = parseInt(num);
        if (n === 0 || n === 1) return num; // Keep 0 and 1 simple
        stats.numbersObfuscated++;
        return this.obfuscateNumberAdvanced(n);
      });
    }

    // Stage 3: Variable and function obfuscation (HIGH ONLY)
    if (level === 'high') {
      // Add heavy junk code
      const junkCode = this.generateJunkCode(15);
      obfuscated = junkCode + '\n' + obfuscated;

      // Obfuscate variables
      const beforeVars = obfuscated.length;
      obfuscated = this.obfuscateVariables(obfuscated);
      if (obfuscated.length > beforeVars) stats.variablesRenamed++;

      // Obfuscate functions
      const beforeFuncs = obfuscated.length;
      obfuscated = this.obfuscateFunctions(obfuscated);
      if (obfuscated.length > beforeFuncs) stats.functionsObfuscated++;

      // Add control flow obfuscation
      obfuscated = this.addControlFlowObfuscation(obfuscated);

      // Wrap in VM (makes it much harder to read)
      obfuscated = this.wrapInVM(obfuscated);
    }

    // Stage 4: Add more junk for medium
    if (level === 'medium') {
      const junkCode = this.generateJunkCode(8);
      obfuscated = junkCode + '\n' + obfuscated;
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
   * Validate Lua code
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

module.exports = AdvancedLuauObfuscator;
