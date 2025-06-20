// components/chat/ChatScreen.tsx
import { useGetConversationsQuery } from '@/features/chat/api/chatApi'
import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../../constants/theme'
import { Loader, SearchBar } from '../common'
import { WithLayout } from '../layouts/WithLayout'
import { ChatList, ChatListData } from './ChatList'

export const ChatScreen: React.FC = () => {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const { data: convos = [], isLoading, error } = useGetConversationsQuery()

  // build data with the ChatListData shape
  const filtered: ChatListData[] = convos
    .map(c => ({
      id: c.conversationId,
      avatarUrl: c.user.profilePicture,
      name: c.user.fullName,
      lastMessage:
        c.lastMessage.actionType === 'text'
          ? c.lastMessage.text || ''
          : c.lastMessage.actionType === 'media'
            ? '📷 Media'
            : '🔗 Shared post',
      timestamp: new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: c.unreadCount,
      muted: c.muted,
    }))
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  // now onItemPress gets the data object
  const onPress = useCallback((item: ChatListData) => {
    router.push({
      pathname: '/root/chat/[chatId]',
      params: {
        chatId: item.id,
        avatarUrl: item.avatarUrl,
        name: item.name,
      },
    });
  }, [router]);
console.log({filtered});

  return (
    <WithLayout>
      <View style={styles.container}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search chats…"
        />
        {isLoading && <Loader />}
        {error && <Text style={{ color: theme.colors.accent }}>Failed to load chats</Text>}

        <ChatList data={filtered} onItemPress={onPress} />
      </View>
    </WithLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12
  },
})
