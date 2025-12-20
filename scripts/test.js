const LuaObfuscator = require('../src/obfuscator');
const authManager = require('../src/utils/auth');

async function runTests() {
  console.log('🧪 Running Nexus Obfuscator Tests\n');

  const obfuscator = new LuaObfuscator();
  await obfuscator.initialize();

  // Test 1: Simple code obfuscation
  console.log('Test 1: Simple code obfuscation');
  const simpleCode = 'print("Hello, World!")';
  const validation = await obfuscator.validateLuaCode(simpleCode);

  if (validation.valid) {
    console.log('✅ Validation passed');
  } else {
    console.log('❌ Validation failed:', validation.error);
    return;
  }

  const result = await obfuscator.obfuscate(simpleCode);

  if (result.success) {
    console.log('✅ Obfuscation successful');
    console.log(`   Original size: ${result.stats.originalSize} bytes`);
    console.log(`   Obfuscated size: ${result.stats.obfuscatedSize} bytes`);
    console.log(`   Ratio: ${result.stats.ratio}x`);
  } else {
    console.log('❌ Obfuscation failed:', result.error);
    return;
  }

  // Test 2: Invalid Lua code
  console.log('\nTest 2: Invalid Lua code validation');
  const invalidCode = 'print("test"';
  const invalidValidation = await obfuscator.validateLuaCode(invalidCode);

  if (!invalidValidation.valid) {
    console.log('✅ Invalid code correctly detected');
  } else {
    console.log('❌ Invalid code not detected');
  }

  // Test 3: Auth system
  console.log('\nTest 3: Authentication system');
  const testUser = await authManager.createUser('test-user-123', 'free');

  if (testUser && testUser.apiKey) {
    console.log('✅ User created successfully');
    console.log(`   API Key: ${testUser.apiKey}`);
    console.log(`   Tier: ${testUser.tier}`);
  } else {
    console.log('❌ User creation failed');
  }

  // Test 4: Rate limiting
  console.log('\nTest 4: Rate limiting');
  const canAccess = authManager.checkRateLimit('test-user-123');

  if (canAccess) {
    console.log('✅ Rate limit check passed');
    authManager.incrementUsage('test-user-123');
    console.log(`   Usage incremented: ${testUser.usage.hourly}`);
  } else {
    console.log('❌ Rate limit exceeded');
  }

  // Test 5: Complex code
  console.log('\nTest 5: Complex code obfuscation');
  const complexCode = `
local function fibonacci(n)
  if n <= 1 then
    return n
  end
  return fibonacci(n - 1) + fibonacci(n - 2)
end

for i = 1, 10 do
  print(fibonacci(i))
end
  `.trim();

  const complexValidation = await obfuscator.validateLuaCode(complexCode);

  if (complexValidation.valid) {
    console.log('✅ Complex code validated');
    const complexResult = await obfuscator.obfuscate(complexCode);

    if (complexResult.success) {
      console.log('✅ Complex code obfuscated successfully');
      console.log(`   Ratio: ${complexResult.stats.ratio}x`);
    } else {
      console.log('❌ Complex code obfuscation failed');
    }
  } else {
    console.log('❌ Complex code validation failed');
  }

  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);
