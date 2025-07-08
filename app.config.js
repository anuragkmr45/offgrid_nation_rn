// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'Offgrid Nation',
    slug: 'offgrid-nation',
    scheme: 'offgridnation',
    version: '1.0.0',
    orientation: 'portrait',
    icon: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png',
    userInterfaceStyle: 'automatic',
    ios: {
      buildNumber: '6',
      supportsTablet: true,
      bundleIdentifier: "com.anuragkmr45.offgridnation",
      infoPlist: { ITSAppUsesNonExemptEncryption: false },
      googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: "com.anuragkmr45.offgridnation",
      googleServicesFile: "./google-services.json"
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png',
    },
    plugins: [
      'expo-router',
      "@react-native-google-signin/google-signin"
    ],
    experiments: { typedRoutes: true },
    extra: {
      androidReleaseClientId: process.env.ANDROID_RELEASE_CLIENT_ID,
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
      username: process.env.APP_USERNAME,
      password: process.env.APP_PASSWORD,
      googleClientId: "758180883916-m361lt4ju30lm48pss3lk6ja78g8bsm2.apps.googleusercontent.com",
      "eas": {
        "projectId": "7b24be75-fffd-444e-8bb5-fb53d221c8ff"
      }
    },
  },
};
