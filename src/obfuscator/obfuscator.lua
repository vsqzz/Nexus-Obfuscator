-- Nexus Roblox Obfuscator


-- =========================
-- Args
-- =========================
local inputPath = arg[1]
local outputPath = arg[2]

if not inputPath or not outputPath then
    error("Usage: lua obfuscator.lua <input.lua> <output.lua>")
end

-- =========================
-- Read input
-- =========================
local f = io.open(inputPath, "rb")
if not f then
    error("Cannot open input file: " .. inputPath)
end

local source = f:read("*all")
f:close()

-- =========================
-- Encode to hex
-- =========================
local function encode(src)
    local t = {}
    for i = 1, #src do
        t[#t + 1] = string.format("\\x%02X", src:byte(i))
    end
    return table.concat(t)
end

local encoded = encode(source)

-- =========================
-- Random names
-- =========================
math.randomseed(os.time())

local function rname(len)
    local chars = "abcdefghijklmnopqrstuvwxyz"
    local s = {}
    for i = 1, len do
        local n = math.random(#chars)
        s[i] = chars:sub(n, n)
    end
    return table.concat(s)
end

local PAYLOAD = rname(18)
local DECODE  = rname(16)

-- =========================
-- Build output (NO string.format)
-- =========================
local output =
"--[[ Nexus Lua Obfuscator | Executor Safe ]]\n\n" ..
"local " .. PAYLOAD .. " = \"" .. encoded .. "\"\n\n" ..
"local function " .. DECODE .. "(s)\n" ..
"    local t = {}\n" ..
"    for h in s:gmatch(\"\\\\x(%x%x)\") do\n" ..
"        t[#t + 1] = string.char(tonumber(h, 16))\n" ..
"    end\n" ..
"    return table.concat(t)\n" ..
"end\n\n" ..
"local f = loadstring(" .. DECODE .. "(" .. PAYLOAD .. "))\n" ..
"if f then\n" ..
"    return f()\n" ..
"end\n"

-- =========================
-- Write output
-- =========================
local out = io.open(outputPath, "wb")
if not out then
    error("Cannot write output file: " .. outputPath)
end

out:write(output)
out:close()

print("✔ Obfuscation complete")
print("✔ Output:", outputPath)
