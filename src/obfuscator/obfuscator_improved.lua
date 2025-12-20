-- Improved Nexus Obfuscator v2.0
-- Fixes: Better instruction handling, improved error handling, configurable options

local byte = string.byte
local sub = string.sub
local insert = table.insert
local concat = table.concat
local random = math.random
local tostr = tostring

-- Settings
local Signature = [[
--= Obfuscated with Nexus Obfuscator v2.0 =--
--= VM-Hash: variable:vmhash =--
--= Protection Level: variable:protectionlevel =--
]]

-- MD5 (keeping the original implementation)
local MD5 = (function()
  -- [MD5 implementation from original - keeping it compact]
  -- ... (using the original MD5 code)
end)()

-- Enhanced random string generator with better entropy
local function randomstring(seed, minLen, maxLen)
  math.randomseed(seed * os.time() + seed)
  local length = random(minLen or 8, maxLen or 20)
  local chars = {
    'i', 'l', 'I', 'L', 'o', 'O', '0',
    'I', 'll', 'lI', 'Il', 'II'
  }
  local str = {}

  for i = 1, length do
    local idx = random(1, #chars)
    insert(str, chars[idx])
  end

  return concat(str)
end

-- Parse command line arguments
local inputFile = arg[1]
local outputPath = arg[2] or 'output/output.txt'
local protectionLevel = arg[3] or 'standard'

if not inputFile then
  print("Error: No input file specified")
  print("Usage: lua obfuscator_improved.lua <input.lua> [output.txt] [protection_level]")
  os.exit(1)
end

-- Verify input file exists
local input = io.open(inputFile, 'r')
if not input then
  print("Error: Cannot open input file: " .. inputFile)
  os.exit(1)
end
input:close()

-- Convert to bytecode with error handling
local compileCmd = "luac -s -o luac.out " .. inputFile
local success = os.execute(compileCmd)

if not success then
  print("Error: Failed to compile Lua file. Check syntax.")
  os.exit(1)
end

-- Read bytecode
local luacFile = io.open('luac.out', 'rb')
if not luacFile then
  print("Error: Failed to read compiled bytecode")
  os.exit(1)
end

local luac = luacFile:read('*all')
luacFile:close()

-- Convert bytecode to escaped format
local code = {}
for i = 1, #luac do
  insert(code, '\\')
  insert(code, byte(luac, i))
end

-- Generate random opcode types (improved with better ranges)
local ABC = random(1, 9)
local ABx = random(1, 9)
local AsBx = random(1, 9)

-- Ensure they're different
while ABx == ABC do ABx = random(1, 9) end
while AsBx == ABC or AsBx == ABx do AsBx = random(1, 9) end

-- Read template
local templatePath = arg[4] or 'template.out'
local templateFile = io.open(templatePath, 'rb')
if not templateFile then
  print("Error: Cannot find template file: " .. templatePath)
  os.exit(1)
end

local lbi = templateFile:read('*all')
templateFile:close()

-- Apply variable substitutions with unique random names
local timestamp = os.time()
lbi = lbi
  :gsub('variable:bytecode', concat(code))
  :gsub('0x1A', '0x'..tostr(ABC))
  :gsub('0x2A', '0x'..tostr(ABx))
  :gsub('0x3A', '0x'..tostr(AsBx))
  :gsub('variable:protoindex:1', randomstring(timestamp + 1, 10, 25))
  :gsub('variable:protoindex:2', randomstring(timestamp + 2, 10, 25))
  :gsub('variable:protoindex:3', randomstring(timestamp + 3, 10, 25))
  :gsub('variable:protoindex:4', randomstring(timestamp + 4, 10, 25))
  :gsub('variable:dataindex:1', randomstring(timestamp + 5, 10, 25))
  :gsub('variable:dataindex:2', randomstring(timestamp + 6, 10, 25))
  :gsub('variable:dataindex:3', randomstring(timestamp + 7, 10, 25))
  :gsub('variable:datakey:1', randomstring(timestamp + 8, 10, 25))
  :gsub('variable:datakey:2', randomstring(timestamp + 9, 10, 25))
  :gsub('variable:datakey:3', randomstring(timestamp + 10, 10, 25))

-- Create output directory if it doesn't exist
local outputDir = outputPath:match("(.*/)")
if outputDir then
  os.execute("mkdir -p " .. outputDir)
end

-- Write initial output
local final = io.open(outputPath, 'wb')
if not final then
  print("Error: Cannot write to output file: " .. outputPath)
  os.exit(1)
end
final:write(lbi)
final:close()

-- Minify if Node.js is available
local minifySuccess = os.execute('node minify.js 2>/dev/null')

-- Read the final output for MD5
local finalFile = io.open(outputPath, 'rb')
local finalContent = finalFile:read('*all')
finalFile:close()

-- Apply signature with MD5 hash
local vmHash = MD5(finalContent)
local sig = Signature
  :gsub('variable:vmhash', vmHash)
  :gsub('variable:protectionlevel', protectionLevel)

-- Write final output with signature
final = io.open(outputPath, 'wb')
final:write(sig .. '\n' .. finalContent)
final:close()

-- Cleanup
os.remove('luac.out')

print('Obfuscation completed successfully!')
print('Output: ' .. outputPath)
print('VM Hash: ' .. vmHash)
print('Protection Level: ' .. protectionLevel)
