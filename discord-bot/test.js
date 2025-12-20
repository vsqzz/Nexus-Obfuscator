#!/usr/bin/env node

/**
 * Quick test for the obfuscator engine
 */

const LuauObfuscator = require('./obfuscator');

const testCode = `
local player = game.Players.LocalPlayer
local message = "Hello, World!"

print(message)
print("Player name:", player.Name)

local health = 100
local damage = 25
print("Health:", health - damage)
`;

console.log('Testing Nexus Obfuscator Engine...\n');

const obfuscator = new LuauObfuscator();

// Test validation
console.log('1️⃣ Testing validation...');
const validation = obfuscator.validate(testCode);
console.log(`   ${validation.valid ? '✅' : '❌'} Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);

if (!validation.valid) {
  console.log(`   Error: ${validation.error}`);
  process.exit(1);
}

// Test all levels
const levels = ['low', 'medium', 'high'];

for (const level of levels) {
  console.log(`\n2️⃣ Testing ${level.toUpperCase()} level...`);

  const result = obfuscator.obfuscate(testCode, { level });

  if (result.success) {
    console.log(`   ✅ Success!`);
    console.log(`   📊 Stats:`);
    console.log(`      - Original: ${result.stats.originalSize} bytes`);
    console.log(`      - Obfuscated: ${result.stats.obfuscatedSize} bytes`);
    console.log(`      - Ratio: ${result.stats.ratio}x`);
    console.log(`      - Strings encrypted: ${result.stats.stringsEncrypted}`);
    console.log(`      - Numbers obfuscated: ${result.stats.numbersObfuscated}`);
    console.log(`      - Variables renamed: ${result.stats.variablesRenamed}`);
  } else {
    console.log(`   ❌ Failed: ${result.error}`);
    process.exit(1);
  }
}

console.log('\n✅ All tests passed!\n');
console.log('The obfuscator is ready to use.');
console.log('Run "npm start" to start the Discord bot.\n');
