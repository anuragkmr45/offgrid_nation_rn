// components/chat/ChatScreen.tsx
import { AVATAR_FALLBACK } from '@/constants/AppConstants'
import { useGetConversationsQuery } from '@/features/chat/api/chatApi'
import { useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { theme } from '../../constants/theme'
import { Loader, SearchBar } from '../common'
import { UserSearchModal } from '../common/UserSearchModal'
import { WithLayout } from '../layouts/WithLayout'
import { ChatList, ChatListData } from './ChatList'

function isValidConvo(raw: any): raw is {
  conversationId: string
  user: {
    profilePicture: string
    fullName: string
    username: string
    _id: string
  }
  lastMessage: {
    actionType: 'text' | 'media' | 'link'
    text?: string
  }
  updatedAt: string
  unreadCount: number
} {
  if (!raw || typeof raw !== 'object') return false
  if (typeof raw.conversationId !== 'string') return false

  const u = raw.user
  if (!u || typeof u.profilePicture !== 'string' ||
    typeof u.fullName !== 'string' ||
    typeof u.username !== 'string' ||
    typeof u._id !== 'string') {
    return false
  }

  const lm = raw.lastMessage
  if (!lm || !['text', 'media', 'link'].includes(lm.actionType)) return false
  if (lm.actionType === 'text' && typeof lm.text !== 'string') return false

  if (typeof raw.updatedAt !== 'string') return false
  if (typeof raw.unreadCount !== 'number') return false

  return true
}

export const ChatScreen: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sheetVisible, setSheetVisible] = useState(false)
  const router = useRouter()

  const { data: convos = [], isLoading, error, refetch } = useGetConversationsQuery()

  // prepare full list of chats
  const items: ChatListData[] = useMemo(() => {
    const term = search.trim().toLowerCase()
    return convos
      .filter(isValidConvo)
      .map(({
        conversationId: id,
        user: {
          profilePicture: avatarUrl,
          fullName: name,
          username,
          _id: recipientId,
        },
        lastMessage,
        updatedAt,
        unreadCount,
      }) => ({
        id,
        avatarUrl,
        name,
        username,
        recipientId,
        lastMessage:
          lastMessage.actionType === 'text'
            ? lastMessage.text!
            : lastMessage.actionType === 'media'
              ? '📷 Media'
              : '🔗 Shared post',
        timestamp: new Date(updatedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        unreadCount,
      }))
      .filter(item =>
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.username.toLowerCase().includes(term)
      )
  }, [convos, search])

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
    const { recipientId, name, username, avatarUrl } = item || {};
    
    if (recipientId.length !== 0) {
      router.push({
        pathname: '/root/chat/Conversation',
        params: {
          recipientId: recipientId,
          recipientName: name || username || "",
          profilePicture: avatarUrl ?? AVATAR_FALLBACK,
        },
      })
    } else {
      Toast.show({type: 'error', text1: 'Unable to open chat'})
    }
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
            const { _id, fullName, username, profilePicture } = user || {}
            if (_id) {
              router.push({
                pathname: '/root/chat/Conversation',
                params: {
                  recipientId: _id,
                  recipientName: fullName || username,
                  profilePicture: profilePicture || AVATAR_FALLBACK,
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
