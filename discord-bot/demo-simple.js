const AdvancedLuauObfuscator = require('./obfuscator');

const simpleCode = `print("Hello")`;

const obfuscator = new AdvancedLuauObfuscator();

console.log('📌 ORIGINAL CODE:');
console.log(simpleCode);
console.log('\n' + '='.repeat(80));

console.log('\n📌 LOW LEVEL OUTPUT (what you see):');
const result = obfuscator.obfuscate(simpleCode, { level: 'low' });
console.log(result.code);

console.log('\n' + '='.repeat(80));
console.log('📌 EXPLANATION:');
console.log('This is NOT bytecode! It\'s still Lua source code.');
console.log('The string "Hello" is encrypted as numbers using XOR.');
console.log('At runtime, it decrypts back to "Hello".');
console.log('\nThis works in Roblox loadstring() because it\'s SOURCE CODE, not bytecode!');
