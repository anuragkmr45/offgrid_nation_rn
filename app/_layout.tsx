// app/_layout.tsx
import * as Notifications from 'expo-notifications';
import { Slot, useNavigationContainerRef, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store/store';

import { LogoutListener } from '@/components/common/LogoutListener';
import { useAppSelector } from '@/store/hooks';
import { RC_IOS_PUBLIC_KEY, SENTRY_DSN } from '@/utils/env';
import { PusherService } from '@/utils/PusherService';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';

const navigationIntegration = Sentry.reactNavigationIntegration({
  // nice on real builds; skip in Expo Go
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV ?? (__DEV__ ? 'development' : 'production'),
  sendDefaultPii: false,

  // Performance sampling (tune as you like)
  tracesSampleRate: __DEV__ ? 0.0 : 0.2,

  // Add all your integrations here
  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // Better frame metrics on device builds (not in Expo Go)
  enableNativeFramesTracking: !isRunningInExpoGo(),

  // Optional: avoid sending events in dev
  enabled: !__DEV__,
});

// 1️⃣ Handle foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RevenueCatBootstrap() {
  const userId = useAppSelector(s => s.auth?.user?._id);

  // Configure once, early
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    // (optional while debugging)
    Purchases.setLogLevel?.(LOG_LEVEL?.VERBOSE ?? 3);
    Purchases.configure({ apiKey: RC_IOS_PUBLIC_KEY });
  }, []);

  // Keep RC identity in sync with your auth
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    (async () => {
      try {
        if (userId) await Purchases.logIn(String(userId));
        else await Purchases.logOut(); // if you support logout/switch user
      } catch { }
    })();
  }, [userId]);

  // One global listener (avoid re-adding in feature hooks)
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const listener = (info: CustomerInfo) => {
      // You can dispatch to Redux or trigger your backend sync here if desired
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      // remove on unmount to avoid leaks/duplicates
      Purchases.removeCustomerInfoUpdateListener?.(listener);
    };
  }, []);

  return null;
}

// 🔔 Move all notification + Pusher logic into this child component
function NotificationListener() {
  const router = useRouter();
  const userId = useAppSelector(s => s.auth.user?._id);
  const pusherSvc = PusherService.getInstance();
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Register for (local) notifications
    async function registerForPush() {
      try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;
        if (existing !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') return;
        const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
        // TODO: send expoToken to backend if you need remote pushes
      } catch (err: any) {
        console.warn('[Push] registration failed:', err.message);
      }
    }
    registerForPush();

    // Subscribe to Pusher push-noti channel
    if (userId) {
      pusherSvc.init();
      const channel = pusherSvc.subscribeChannel(`notifications.${userId}`);
      channel.bind('push-noti', (data: any) => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: `${data.sender.username} sent you a message`,
            body:
              data?.actionType === 'text'
                ? data.text
                : data?.actionType === 'media'
                  ? `${data.sender.username} sent a media file`
                  : `${data.sender.username} shared a post`,
            data: { recipientId: data.sender._id, recipientName: data.sender.username, recipientAvatar: data.sender.profilePicture },
          },
          trigger: null,
        });
      });
    }

    // Handle tap on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as {
        recipientId?: string;
        recipientName?: string;
        recipientAvatar?: string;
      };

      if (data.recipientId) {
        router.push({
          pathname: '/root/chat/Conversation', params: {
            recipientId: data.recipientId,
            recipientName: data.recipientName,
            profilePicture: data.recipientAvatar,
          }
        });
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      pusherSvc.disconnect();
    };
  }, [userId]);

  return null;
}

export default Sentry.wrap(function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);
  return (
    <Sentry.ErrorBoundary>
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" />
            </View>
          }
          persistor={persistor}
        >
          <SafeAreaProvider>
            <NotificationListener />
            <RevenueCatBootstrap />
            <Slot />
            <Toast
              position="top"
              topOffset={
                Platform.select({
                  android: (StatusBar.currentHeight ?? 0) + 8,
                  ios: 54,
                  default: 24,
                }) as number
              }
            />
            <LogoutListener />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  );
});