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
    ios: { supportsTablet: true, buildeIdentifier: "com.anuragkmr_45.offgridnation" },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: "com.anuragkmr_45.offgridnation"
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      // '@react-native-google-signin/google-signin'
      // [
      //   'expo-splash-screen',
      //   {
      //     image: './assets/images/splash-icon.png',
      //     imageWidth: 200,
      //     resizeMode: 'contain',
      //     backgroundColor: '#ffffff',
      //   },
      // ],
    ],
    experiments: { typedRoutes: true },
    extra: {
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    },
  },
};
