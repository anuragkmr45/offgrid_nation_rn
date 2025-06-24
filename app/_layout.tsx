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

import { useAppSelector } from '@/store/hooks';
import { PusherService } from '@/utils/PusherService';

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
        console.log('Expo push token:', expoToken);
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
        console.log({data});
        
        Notifications.scheduleNotificationAsync({
          content: {
            title: `${data.sender.username} sent you a message`,
            body:
              data?.actionType === 'text'
                ? data.text
                : data?.actionType === 'media'
                ? `${data.sender.username} sent a media file`
                : `${data.sender.username} shared a post`,
            data: { conversationId: data.conversationId },
          },
          trigger: null,
        });
      });
    }

    // Handle tap on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const convId = response.notification.request.content.data.conversationId;
      if (convId) {
        router.push('/root/chat/Conversation');
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

export default function RootLayout() {
  return (
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
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
