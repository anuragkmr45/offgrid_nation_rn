// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    // Enable more aggressive dead-code elimination
    config.transformer.minifierConfig = {
        compress: {
            unused: true,
            dead_code: true,
            toplevel: true,
            pure_funcs: ['console.log'], // drop all console.log calls
        },
        mangle: {
            toplevel: true,
        },
        output: {
            comments: false,
            ascii_only: true,
        },
    };

    // Optional: inline requires for faster startup / finer handshake
    config.transformer.inlineRequires = true;

    // metro.config.js additions
    config.serializer = {
        // createModuleIdFactory: /* expo’s default */,
        // processModuleFilter: /* leave in only what you import */,
        // getRunModuleStatement: /* default */,
        // polyfillModuleNames: /* default */,
        // enable inline requires
        experimentalSerializerHook: () => ({ unstable_enableExportMap: true }),
    };
    config.transformer = {
        ...config.transformer,
        experimentalImportSupport: true,
        inlineRequires: true,
    };


    return config;
})();
