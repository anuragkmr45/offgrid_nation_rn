// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'Offgrid Nation',
    slug: 'offgrid-nation',
    scheme: 'offgrid',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    ios: { supportsTablet: true, bundleIdentifier: "com.anuragkmr45.offgridnation",infoPlist: { ITSAppUsesNonExemptEncryption: false} },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: "com.anuragkmr45.offgridnation"
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
    ],
    experiments: { typedRoutes: true },
    extra: {
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      eas: {
        projectId: "7131e8cf-6f8c-4ccd-bcc4-fab788fd5d7c"
      }
    },
  },
};
