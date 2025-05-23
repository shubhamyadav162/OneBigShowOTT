const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
// Import exclusionList helper to build blockList patterns
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;
// Generate default Expo Metro config
const config = getDefaultConfig(projectRoot);

// Add support for cjs and mjs extensions to resolve Firebase modules
config.resolver.sourceExts.push('cjs', 'mjs');

// Exclude large or irrelevant directories to prevent I/O errors and unnecessary scanning
config.resolver.blockList = exclusionList([
  /supabase-mcp-server[\/\\].*/,        // Supabase server code
  /firebase-mcp-main[\/\\].*/,          // Firebase MCP server code
  /tmp_build_dir[\/\\].*/,              // Temporary build directory
  /functions[\/\\].*/,                  // Cloud functions folder
  /\.expo[\/\\].*/,                   // Expo cache directory
]);
config.maxWorkers = 4;
config.watchFolders = [projectRoot];
config.reporter = {
  update: () => {},
};

module.exports = config; 