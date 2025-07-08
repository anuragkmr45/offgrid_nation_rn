// // metro.config.js
// const { getDefaultConfig, mergeConfig } = require('expo/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);

// module.exports = mergeConfig(defaultConfig, {
//     transformer: {
//         // your custom minifier settings
//         minifierConfig: {
//             compress: {
//                 unused: true,
//                 dead_code: true,
//                 toplevel: true,
//                 pure_funcs: ['console.log'],
//             },
//             mangle: {
//                 toplevel: true,
//             },
//             output: {
//                 comments: false,
//                 ascii_only: true,
//             },
//         },
//         // speed up JS startup
//         inlineRequires: true,
//         // if you need import() support
//         experimentalImportSupport: true,
//     },
//     resolver: {
//         // add any extra extensions you need (e.g. .cjs)
//         assetExts: defaultConfig.resolver.assetExts,
//         sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
//     },
//     // **no** serializer override here – keep the default!
// });

// metro.config.js

// Ensure NODE_ENV is set (Gradle/Expo bundle sometimes runs without it)
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { getDefaultConfig } = require('expo/metro-config');

// Either sync or async—in your RN version sync works fine.
const defaultConfig = getDefaultConfig(__dirname);

// 1) Transformer tweaks
defaultConfig.transformer.minifierConfig = {
    compress: {
        unused: true,
        dead_code: true,
        toplevel: true,
        pure_funcs: ['console.log'],
    },
    mangle: {
        toplevel: true,
    },
    output: {
        comments: false,
        ascii_only: true,
    },
};
defaultConfig.transformer.inlineRequires = true;
defaultConfig.transformer.experimentalImportSupport = true;

// 2) Allow importing .cjs if you need it
defaultConfig.resolver.sourceExts = [
    ...defaultConfig.resolver.sourceExts,
    'cjs',
];

module.exports = defaultConfig;
