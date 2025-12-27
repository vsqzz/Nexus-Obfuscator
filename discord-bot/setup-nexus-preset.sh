#!/bin/bash
# Setup script for Nexus Prometheus Preset

echo "Setting up Nexus Enhanced Prometheus Preset..."

# Check if Prometheus is cloned
if [ ! -d "prometheus-obfuscator" ]; then
    echo "Error: prometheus-obfuscator directory not found!"
    echo "Run setup.sh first to clone Prometheus"
    exit 1
fi

# Backup original presets.lua
if [ ! -f "prometheus-obfuscator/src/presets.lua.backup" ]; then
    echo "Creating backup of original presets.lua..."
    cp prometheus-obfuscator/src/presets.lua prometheus-obfuscator/src/presets.lua.backup
fi

# Check if Nexus preset already exists
if grep -q '\"Nexus\"' prometheus-obfuscator/src/presets.lua; then
    echo "Nexus preset already installed!"
    exit 0
fi

# Add Nexus preset to presets.lua
echo "Adding Nexus preset to presets.lua..."

# Insert Nexus preset before the closing brace
sed -i '/^    },$/,/^}$/ {
    /^}$/ i\    };\n    ["Nexus"] = {\n        LuaVersion = "Lua51";\n        VarNamePrefix = "";\n        NameGenerator = "MangledShuffled";\n        PrettyPrint = false;\n        Seed = 0;\n        Steps = {\n            { Name = "Vmify"; Settings = {}; },\n            { Name = "EncryptStrings"; Settings = {}; },\n            { Name = "SplitStrings"; Settings = {}; },\n            { Name = "AntiTamper"; Settings = { UseDebug = true; }; },\n            { Name = "Vmify"; Settings = {}; },\n            { Name = "ConstantArray"; Settings = { Treshold = 1; StringsOnly = false; Shuffle = true; Rotate = true; LocalWrapperTreshold = 1; }; },\n            { Name = "NumbersToExpressions"; Settings = {}; },\n            { Name = "ProxifyLocals"; Settings = {}; },\n            { Name = "Vmify"; Settings = {}; },\n            { Name = "WrapInFunction"; Settings = {}; },\n        }\n    };
}' prometheus-obfuscator/src/presets.lua

echo "✓ Nexus preset installed successfully!"
echo ""
echo "You can now use --preset Nexus with Prometheus CLI"
echo "Or use the Discord bot which automatically uses Nexus for medium/high levels"
