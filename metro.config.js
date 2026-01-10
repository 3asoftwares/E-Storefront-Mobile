const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Force Metro to only use mobile-app's node_modules
// This prevents conflicts with workspace root packages
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

// Disable watching other folders to improve performance on Windows
config.watchFolders = [];

// Enable web support and mjs files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

// Force specific packages to resolve from local node_modules only
const localNodeModules = path.resolve(projectRoot, 'node_modules');
config.resolver.extraNodeModules = {
    'react': path.resolve(localNodeModules, 'react'),
    'react-dom': path.resolve(localNodeModules, 'react-dom'),
    'react-native': path.resolve(localNodeModules, 'react-native'),
    'react-native-web': path.resolve(localNodeModules, 'react-native-web'),
    'expo': path.resolve(localNodeModules, 'expo'),
    'expo-router': path.resolve(localNodeModules, 'expo-router'),
};

// Performance optimizations for faster bundling
config.transformer = {
    ...config.transformer,
    minifierConfig: {
        keep_classnames: false,
        keep_fnames: false,
        mangle: true,
        reserved: [],
        toplevel: false,
    },
};

// Increase max workers for faster bundling
config.maxWorkers = 4;

// Cache optimization
config.cacheStores = config.cacheStores || [];

module.exports = config;
