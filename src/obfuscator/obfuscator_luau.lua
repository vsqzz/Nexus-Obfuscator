--[[
    Nexus Obfuscator - Roblox/Luau Edition
    Source-to-source obfuscation for Roblox scripts
    Compatible with loadstring() in Roblox
]]

local byte = string.byte
local char = string.char
local sub = string.sub
local concat = table.concat
local insert = table.insert
local random = math.random
local floor = math.floor

-- Luau-specific AST parser
local function parseLua(code)
    -- Simple tokenizer for Lua code
    local tokens = {}
    local keywords = {
        ['and'] = true, ['break'] = true, ['do'] = true, ['else'] = true,
        ['elseif'] = true, ['end'] = true, ['false'] = true, ['for'] = true,
        ['function'] = true, ['if'] = true, ['in'] = true, ['local'] = true,
        ['nil'] = true, ['not'] = true, ['or'] = true, ['repeat'] = true,
        ['return'] = true, ['then'] = true, ['true'] = true, ['until'] = true,
        ['while'] = true
    }

    return {
        keywords = keywords,
        code = code
    }
end

-- Generate random variable name
local function randomVar(seed)
    math.randomseed(seed + os.time())
    local length = random(8, 16)
    local chars = {'l', 'I', 'i', 'L', 'O', 'o', '0', '_'}
    local name = {}

    -- First char must be letter or underscore
    name[1] = chars[random(1, 4)]

    for i = 2, length do
        name[i] = chars[random(1, #chars)]
    end

    return concat(name)
end

-- Encrypt a string
local function encryptString(str, key)
    local encrypted = {}
    key = key or random(1, 255)

    for i = 1, #str do
        local b = byte(str, i)
        encrypted[i] = b ~ key -- XOR encryption
    end

    return encrypted, key
end

-- Generate string decryption code
local function generateStringDecryptor(encrypted, key)
    local bytes = {}
    for i = 1, #encrypted do
        bytes[i] = tostring(encrypted[i])
    end

    return string.format(
        "(function() local t={%s} local s='' for i=1,#t do s=s..string.char(t[i]~%d) end return s end)()",
        concat(bytes, ','),
        key
    )
end

-- Obfuscate numbers
local function obfuscateNumber(num)
    local methods = {
        -- Method 1: Bit operations
        function(n)
            local a, b = random(1, 100), random(1, 100)
            return string.format("((%d+%d)-%d)", n + b, a, a + b)
        end,
        -- Method 2: Math operations
        function(n)
            local div = random(2, 10)
            return string.format("(%d*%d/%d)", n, div, div)
        end,
        -- Method 3: Bit XOR
        function(n)
            local key = random(1, 255)
            return string.format("(%d~%d~%d)", n, key, key)
        end
    }

    return methods[random(1, #methods)](num)
end

-- Main obfuscation function
local function obfuscate(code, options)
    options = options or {}
    local obfLevel = options.level or 'medium'

    local output = {}
    local stringCache = {}
    local varMap = {}
    local varCounter = 0

    -- Add header comment
    insert(output, "-- Obfuscated by Nexus Obfuscator")
    insert(output, "-- https://github.com/your-repo")
    insert(output, "")

    -- Stage 1: String encryption
    local stringPattern = [["([^"]*)"]]
    local processedCode = code:gsub(stringPattern, function(str)
        if str == "" then return '""' end

        local encrypted, key = encryptString(str)
        local decryptor = generateStringDecryptor(encrypted, key)
        return decryptor
    end)

    -- Also handle single-quoted strings
    stringPattern = [['([^']*)']]
    processedCode = processedCode:gsub(stringPattern, function(str)
        if str == "" then return "''" end

        local encrypted, key = encryptString(str)
        local decryptor = generateStringDecryptor(encrypted, key)
        return decryptor
    end)

    -- Stage 2: Number obfuscation
    if obfLevel ~= 'low' then
        processedCode = processedCode:gsub("(%d+)", function(num)
            local n = tonumber(num)
            if n and n > 0 and n < 1000 then
                return obfuscateNumber(n)
            end
            return num
        end)
    end

    -- Stage 3: Variable renaming
    if obfLevel == 'high' then
        -- Find local variables and rename them
        processedCode = processedCode:gsub("local%s+([%w_]+)", function(varName)
            if not varMap[varName] then
                varCounter = varCounter + 1
                varMap[varName] = randomVar(varCounter)
            end
            return "local " .. varMap[varName]
        end)

        -- Replace variable usages
        for original, obfuscated in pairs(varMap) do
            processedCode = processedCode:gsub("([^%w_])" .. original .. "([^%w_])",
                "%1" .. obfuscated .. "%2")
        end
    end

    -- Stage 4: Add junk code (anti-analysis)
    if obfLevel == 'high' then
        local junk = {
            "local " .. randomVar(9999) .. " = " .. obfuscateNumber(random(1, 100)),
            "local " .. randomVar(8888) .. " = function() return nil end"
        }

        insert(output, junk[random(1, #junk)])
        insert(output, "")
    end

    insert(output, processedCode)

    return concat(output, "\n")
end

-- Command line interface
local function main()
    local inputFile = arg[1]
    local outputFile = arg[2] or 'output/obfuscated.lua'
    local level = arg[3] or 'medium'

    if not inputFile then
        print("Usage: lua obfuscator_luau.lua <input.lua> [output.lua] [level]")
        print("Levels: low, medium, high")
        return 1
    end

    -- Read input
    local input = io.open(inputFile, 'r')
    if not input then
        print("Error: Cannot open input file: " .. inputFile)
        return 1
    end

    local code = input:read('*all')
    input:close()

    -- Obfuscate
    print("Obfuscating with level: " .. level)
    local obfuscated = obfuscate(code, { level = level })

    -- Write output
    local output = io.open(outputFile, 'w')
    if not output then
        print("Error: Cannot write to output file: " .. outputFile)
        return 1
    end

    output:write(obfuscated)
    output:close()

    print("Success! Obfuscated code written to: " .. outputFile)
    print("Original size: " .. #code .. " bytes")
    print("Obfuscated size: " .. #obfuscated .. " bytes")

    return 0
end

-- Run if called directly
if arg and arg[0] then
    os.exit(main())
end

-- Export for use as module
return {
    obfuscate = obfuscate,
    version = "2.0-luau"
}
