// components/chat/ChatScreen.tsx
import { useGetConversationsQuery } from '@/features/chat/api/chatApi'
import { useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { theme } from '../../constants/theme'
import { Loader, SearchBar } from '../common'
import { UserSearchModal } from '../common/UserSearchModal'
import { WithLayout } from '../layouts/WithLayout'
import { ChatList, ChatListData } from './ChatList'

export const ChatScreen: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sheetVisible, setSheetVisible] = useState(false)
  const router = useRouter()

  const { data: convos = [], isLoading, error, refetch } = useGetConversationsQuery()

  // prepare full list of chats
  const items: ChatListData[] = useMemo(
    () =>
      convos.map(c => ({
        id: c.conversationId,
        avatarUrl: c.user.profilePicture,
        name: c.user.fullName,
        username: c.user.username,
        recipientId: c.user._id,
        lastMessage:
          c.lastMessage.actionType === 'text'
            ? c.lastMessage.text || ''
            : c.lastMessage.actionType === 'media'
              ? '📷 Media'
              : '🔗 Shared post',
        timestamp: new Date(c.updatedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        unreadCount: c.unreadCount,
      })),
    [convos]
  )

  // filter by search term
  // const filtered: ChatListData[] = useMemo(
  //   () =>
  //     items.filter(i =>
  //       i.name.toLowerCase().includes(search.toLowerCase())
  //     ),
  //   [items, search]
  // )

  // navigate into conversation
  const onPress = useCallback((item: ChatListData) => {
    router.push({
      pathname: '/root/chat/Conversation',
      params: {
        recipientId: item.recipientId,
        recipientName: item.name || item.username,
        profilePicture: item.avatarUrl,
      },
    })
  }, [router])

  return (
    <WithLayout>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSheetVisible(true)}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search chats…"
            editable={false}
          />
        </TouchableOpacity>

        {isLoading && <Loader />}
        {error && (
          <Text style={styles.errorText}>
            Failed to load chats
          </Text>
        )}

        {/* Main chat list */}
        <ChatList data={items} onItemPress={onPress} />

        {/* User search modal for finding/starting chats */}
        <UserSearchModal
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          onSelect={user => {
            if (user._id) {
              router.push({
                pathname: '/root/chat/Conversation',
                params: {
                  recipientId: user._id,
                  recipientName: user.fullName || user.username,
                  profilePicture: user.profilePicture,
                },
              })
            }
            setSheetVisible(false)
          }}
          placeholder="Search users…"
          height="57%"
        />
      </View>
    </WithLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
  },
  errorText: {
    color: theme.colors.accent,
    textAlign: 'center',
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
})
