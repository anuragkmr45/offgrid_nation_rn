// app/root/chat/[chatId].tsx

import { ConversationScreen } from '@/components/chat/ConversationScreen';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { AVATAR_FALLBACK } from '@/constants/AppConstants';
import { theme } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatPage() {
  const { recipientId, recipientName, profilePicture } = useLocalSearchParams<{
    recipientId: string;
    recipientName?: string;
    profilePicture?: string;
  }>();
  console.log({ recipientId, recipientName, profilePicture });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar animated backgroundColor={theme.colors.background} barStyle="dark-content" />
      <ProtectedLayout>
        <ConversationScreen
          chatId={recipientId || ""}
          avatarUrl={profilePicture || AVATAR_FALLBACK}
          name={recipientName || "OffgridUser"}
        />
      </ProtectedLayout>
    </SafeAreaView>
  );
}
