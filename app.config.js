// app.config.js
import 'dotenv/config';

export default {
  expo: {
    updates: {
      url: 'https://u.expo.dev/7b24be75-fffd-444e-8bb5-fb53d221c8ff',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    name: 'Offgrid Nation',
    slug: 'offgrid-nation',
    scheme: 'offgridnation',
    description: "A smart community-driven app that blends social networking, real-time alerts, and a peer-powered marketplace - all in one",
    owner: "anuragkmr_45",
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icons/fr-bg-black_rwqtim.png',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anuragkmr45.offgridnation",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: "Take photos and videos for posts and marketplace listings (e.g., your solar setup or gear for sale).",
        NSPhotoLibraryUsageDescription: "Select photos and videos to attach to posts and listings (e.g., pictures of items you are selling).",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Offgrid Nation uses your location in the background to keep your live listing’s address up to date and to notify you about new nearby projects (e.g., “New listing within 500 m”).",
        NSLocationWhenInUseUsageDescription: "Offgrid Nation uses your location to show marketplace projects near you and to prefill the address when you list a project.",
      },
      googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist",
      usesAppleSignIn: true
    },
    android: {
      package: "com.anuragkmr45.offgridnation",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: './assets/icons/fr-bg-black_rwqtim.png',
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
      "expo-apple-authentication",
      ["@react-native-google-signin/google-signin", {
        iosUrlScheme: "com.googleusercontent.apps.758180883916-inav2m4auqj9kt84sqc3jb3apkj8io40"
      }],
      [
        "expo-image-picker",
        {
          photosPermission: "Allow Offgrid Nation to select photos and videos to attach to posts and listings.",
          cameraPermission: "Allow Offgrid Nation to take photos and videos for posts and marketplace listings.",
          microphonePermission: "Allow Offgrid Nation to record audio while capturing video."
        }
      ],
      [
        "expo-location",
        {
          // "locationAlwaysAndWhenInUsePermission": `Allow Offgrid Nation to use your location.`
          locationAlwaysAndWhenInUsePermission: 'Allow Offgrid Nation to use your location.',
          locationWhenInUsePermission: 'Allow Offgrid Nation to access your location to show nearby projects and prefill listing addresses.',
          isIosBackgroundLocationEnabled: false
        }
      ],
      [
        "@sentry/react-native/expo",
        {
          "url": "https://sentry.io/",
          "project": process.env.SENTRY_PROJECT,
          "organization": process.env.SENTRY_ORG
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
      EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
      googleClientId: "758180883916-m361lt4ju30lm48pss3lk6ja78g8bsm2.apps.googleusercontent.com",
      "eas": {
        "projectId": "7b24be75-fffd-444e-8bb5-fb53d221c8ff"
      }
    },
  },
};
