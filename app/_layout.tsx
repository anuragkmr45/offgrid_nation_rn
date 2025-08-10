// app/_layout.tsx
import * as Notifications from 'expo-notifications';
import { Slot, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store/store';

import { LogoutListener } from '@/components/common/LogoutListener';
import { useAppSelector } from '@/store/hooks';
import { PusherService } from '@/utils/PusherService';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://adf2d785eece60a027c09b78b1acd29c@o4509582488305664.ingest.us.sentry.io/4509815215030272',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
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
            <Slot />
            <Toast />
            <LogoutListener />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  );
});