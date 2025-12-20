#!/usr/bin/env node

/**
 * Test script for Nexus Obfuscator
 * Tests the Luau obfuscation engine with sample Roblox code
 */

const LuaObfuscator = require('./src/obfuscator');

// Sample Roblox script
const sampleCode = `
local player = game.Players.LocalPlayer
local message = "Hello, World!"

print(message)
print("Player name:", player.Name)

local function greet(name)
    return "Welcome, " .. name
end

print(greet(player.Name))

-- Simple calculation
local health = 100
local damage = 25
local remaining = health - damage

print("Health remaining:", remaining)
`;

async function testObfuscation() {
  console.log('='.repeat(60));
  console.log('  Nexus Obfuscator - Test Suite');
  console.log('='.repeat(60));
  console.log();

  const obfuscator = new LuaObfuscator();
  await obfuscator.initialize();

  // Test all three levels
  const levels = ['low', 'medium', 'high'];

  for (const level of levels) {
    console.log(`\n📊 Testing ${level.toUpperCase()} level obfuscation...`);
    console.log('-'.repeat(60));

    const result = await obfuscator.obfuscate(sampleCode, {
      type: 'luau',
      level: level
    });

    if (result.success) {
      console.log('✅ Obfuscation successful!');
      console.log(`   Original size:    ${result.stats.originalSize} bytes`);
      console.log(`   Obfuscated size:  ${result.stats.obfuscatedSize} bytes`);
      console.log(`   Ratio:            ${result.stats.ratio}x`);
      console.log(`   Job ID:           ${result.jobId}`);
      console.log();
      console.log('📝 Obfuscated code preview (first 300 chars):');
      console.log('-'.repeat(60));
      console.log(result.code.substring(0, 300) + '...');
    } else {
      console.log('❌ Obfuscation failed!');
      console.log(`   Error: ${result.error}`);
    }
  }

  console.log();
  console.log('='.repeat(60));
  console.log('✅ All tests completed!');
  console.log('='.repeat(60));
  console.log();
  console.log('💡 Next steps:');
  console.log('   1. Copy the obfuscated code');
  console.log('   2. Upload to GitHub (Raw URL)');
  console.log('   3. Test in Roblox with:');
  console.log('      loadstring(game:HttpGet("YOUR_RAW_URL"))()');
  console.log();
}

// Run tests
testObfuscation().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
