const PrometheusObfuscator = require('./obfuscator');

async function test() {
  console.log('Testing Prometheus Obfuscator...\n');

  const obfuscator = new PrometheusObfuscator();
  await obfuscator.initialize();

  // Check if Lua is installed
  console.log('1. Checking Lua installation...');
  const luaInstalled = await obfuscator.checkLuaInstalled();
  if (luaInstalled) {
    console.log('   ✅ Lua is installed!\n');
  } else {
    console.log('   ❌ Lua is NOT installed or not in PATH\n');
    console.log('   Make sure "lua -v" works in your command prompt\n');
    return;
  }

  // Test obfuscation
  console.log('2. Testing obfuscation...');
  const testCode = 'print("Hello World")';

  const result = await obfuscator.obfuscate(testCode, { level: 'low' });

  if (result.success) {
    console.log('   ✅ Obfuscation successful!\n');
    console.log('   Original code:', testCode);
    console.log('   Obfuscated code (first 200 chars):');
    console.log('   ' + result.code.substring(0, 200) + '...\n');
    console.log('   Stats:', result.stats);
  } else {
    console.log('   ❌ Obfuscation failed!\n');
    console.log('   Error:', result.error);
  }
}

test().catch(console.error);
