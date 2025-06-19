// components/chat/ConversationScreen.tsx
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
} from 'react-native'

import { theme } from '../../constants/theme'
import { ChatInputBar } from './ChatInputBar'
import { ConversationHeader } from './ConversationHeader'
import { MessageBubble, MessageBubbleProps } from './MessageBubble'

// replace with your real hook/api
const MOCK_MESSAGES: MessageBubbleProps[] = [
  { text: 'Hello Bro.!', timestamp: '10:20', outgoing: true },
  { text: 'Ha Lala!', timestamp: '10:20', outgoing: false },
  // …etc
]

export const ConversationScreen: React.FC = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>()
  const router = useRouter()

  const handleSend = useCallback((text: string) => {
    // TODO: call send API
    console.log('send to', chatId, text)
  }, [chatId])

  return (
    <SafeAreaView style={styles.container}>
      <ConversationHeader
        avatarUrl={`https://i.pravatar.cc/150?u=${chatId}`}
        name={`User ${chatId}`}
        statusText="Active"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <FlatList
          data={MOCK_MESSAGES}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => <MessageBubble {...item} />}
          contentContainerStyle={styles.messages}
        />
        <ChatInputBar onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  messages: { padding: 12 },
})
