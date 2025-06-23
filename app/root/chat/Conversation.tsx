// app/root/chat/[chatId].tsx

import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ConversationScreen } from '../../../components/chat/ConversationScreen';

export default function ChatPage() {
  const { recipientId, recipientName, profilePicture } = useLocalSearchParams<{
    recipientId: string;
    recipientName?: string;
    profilePicture?: string;
  }>();

  return (
    <ConversationScreen
      chatId={recipientId || ""}
      avatarUrl={profilePicture || "https://res.cloudinary.com/dtxm0dakw/image/upload/v1744723246/r3hsrs6dnpr53idcjtc5.png"}
      name={recipientName || "offgrid-user"}
    />
  );
}
