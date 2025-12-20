const AdvancedLuauObfuscator = require('./obfuscator');

const testCases = [
  { name: 'Simple string', code: 'print("Hello World")' },
  { name: 'Multiple strings', code: 'local a = "foo"\nlocal b = "bar"\nprint(a, b)' },
  { name: 'With numbers', code: 'local x = 100\nprint("Value:", x)' },
  { name: 'Function call', code: 'game:GetService("Players")' }
];

const obfuscator = new AdvancedLuauObfuscator();

console.log('🧪 Testing Lua syntax validity...\n');

for (const test of testCases) {
  console.log(`Testing: ${test.name}`);

  const result = obfuscator.obfuscate(test.code, { level: 'low' });

  if (result.success) {
    // Basic syntax checks
    const code = result.code;

    // Check for common syntax errors
    let hasError = false;
    let errorMsg = '';

    // Check matching loop variables
    const forLoops = code.match(/for\s+(\w+)=.*?do/g);
    if (forLoops) {
      for (const loop of forLoops) {
        const varMatch = loop.match(/for\s+(\w+)=/);
        if (varMatch) {
          const loopVar = varMatch[1];
          // Check if this variable is used in the following code
          const afterDo = code.split(loop)[1];
          const beforeEnd = afterDo.split('end')[0];
          if (!beforeEnd.includes(`[${loopVar}]`)) {
            hasError = true;
            errorMsg = `Loop variable ${loopVar} not used correctly`;
          }
        }
      }
    }

    // Check balanced parentheses
    let parenCount = 0;
    for (const char of code) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) {
        hasError = true;
        errorMsg = 'Unbalanced parentheses';
        break;
      }
    }

    if (hasError) {
      console.log(`  ❌ FAILED: ${errorMsg}`);
    } else {
      console.log(`  ✅ PASSED`);
    }
  } else {
    console.log(`  ❌ Obfuscation failed: ${result.error}`);
  }
}

console.log('\n✅ All syntax checks complete!');
console.log('\n💡 To test in actual Roblox:');
console.log('   1. Use the Discord bot /obfuscate command');
console.log('   2. Upload to GitHub (raw URL)');
console.log('   3. Run: loadstring(game:HttpGet("URL"))()');
