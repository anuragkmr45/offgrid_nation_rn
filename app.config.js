// app.config.js
import 'dotenv/config';


export default {
  expo: {
    updates: {
      url: 'https://u.expo.dev/7b24be75-fffd-444e-8bb5-fb53d221c8ff',  // ← same projectId as in extra.eas
    },
    runtimeVersion: {
      policy: 'appVersion',  // ties native build to expo.version (good default)
    },
    name: 'Offgrid Nation',
    slug: 'offgrid-nation',
    scheme: 'offgridnation',
    version: '1.0.0',
    orientation: 'portrait',
    icon: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anuragkmr45.offgridnation",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription: "We need your location to show nearby listings.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "We use your location even when the app is in the background.",
        UIBackgroundModes: ["location"],
      },
      googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist"
    },
    android: {
      package: "com.anuragkmr45.offgridnation",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png',
        backgroundColor: '#ffffff',
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png',
    },
    plugins: [
      'expo-router',
      "@react-native-google-signin/google-signin",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": `Allow Offgrid Nation to use your location.`
        }
      ]
    ],
    experiments: { typedRoutes: true },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_BASE_URL,
      PUSHER_KEY: process.env.EXPO_PUBLIC_PUSHER_KEY,
      PUSHER_CLUSTER: process.env.EXPO_PUBLIC_PUSHER_CLUSTER,
      oauthWebClientId: process.env.EXPO_PUBLIC_OAUTH_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      androidReleaseClientId: process.env.ANDROID_RELEASE_CLIENT_ID,
      username: process.env.APP_USERNAME,
      password: process.env.APP_PASSWORD,
      googleClientId: "758180883916-m361lt4ju30lm48pss3lk6ja78g8bsm2.apps.googleusercontent.com",
      "eas": {
        "projectId": "7b24be75-fffd-444e-8bb5-fb53d221c8ff"
      }
    },
  },
};
