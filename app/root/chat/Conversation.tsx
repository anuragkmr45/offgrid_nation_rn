// app/root/chat/[chatId].tsx

import { ConversationScreen } from '@/components/chat/ConversationScreen';
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar animated backgroundColor={theme.colors.background} barStyle="dark-content" />
      <ConversationScreen
        chatId={recipientId || ""}
        avatarUrl={profilePicture || "https://res.cloudinary.com/dtxm0dakw/image/upload/v1744723246/r3hsrs6dnpr53idcjtc5.png"}
        name={recipientName || "offgrid-user"}
      />
    </SafeAreaView>
  );
}
