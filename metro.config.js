const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Exclude server directory from being bundled
config.resolver.blockList = [
  /server\/.*/,
];

// Exclude server from watch folders
config.watchFolders = [__dirname];

module.exports = config;
