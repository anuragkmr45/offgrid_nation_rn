// components/chat/ChatScreen.tsx
import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { theme } from '../../constants/theme'
import { SearchBar } from '../common'
import { WithLayout } from '../layouts/WithLayout'
import { ChatList } from './ChatList'

// dummy data shape; replace with real hook
const MOCK_CHATS = [
  {
    id: '1',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    name: 'Claudia Alves',
    lastMessage: "We bend so we don't break.",
    timestamp: 'Now',
    unreadCount: 2,
  },
  // …etc.
]

export const ChatScreen: React.FC = () => {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = MOCK_CHATS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const onPress = useCallback((id: string) => {
    router.push(`/root/chat/${id}`)
  }, [])

  return (
    <WithLayout>
      <View  style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search chats…"
        />
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
