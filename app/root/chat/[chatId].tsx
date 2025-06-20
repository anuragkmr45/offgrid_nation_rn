// app/root/chat/[chatId].tsx

import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ConversationScreen } from '../../../components/chat/ConversationScreen';

export default function ChatPage() {
  const { chatId, avatarUrl, name } = useLocalSearchParams<{
    chatId: string;
    avatarUrl?: string;
    name?: string;
  }>();

  return (
    <ConversationScreen
      chatId={chatId || ""}
      avatarUrl={avatarUrl || "https://res.cloudinary.com/dtxm0dakw/image/upload/v1744723246/r3hsrs6dnpr53idcjtc5.png"}
      name={name || "offgrid user"}
    />
  );
}
