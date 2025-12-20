const AdvancedLuauObfuscator = require('./obfuscator');

const simpleCode = `
local player = game.Players.LocalPlayer
print("Hello World")
local health = 100
`;

const obfuscator = new AdvancedLuauObfuscator();

console.log('='.repeat(80));
console.log('MEDIUM LEVEL OBFUSCATION SAMPLE');
console.log('='.repeat(80));

const result = obfuscator.obfuscate(simpleCode, { level: 'medium' });

console.log(result.code);

console.log('\n' + '='.repeat(80));
console.log('HIGH LEVEL OBFUSCATION SAMPLE');
console.log('='.repeat(80));

const result2 = obfuscator.obfuscate(simpleCode, { level: 'high' });

console.log(result2.code.substring(0, 1500) + '\n...[truncated]');
