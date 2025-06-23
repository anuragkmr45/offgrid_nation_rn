// components/chat/ChatListItem.tsx
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { theme } from '../../constants/theme'

export interface ChatListItemProps {
  id: string
  avatarUrl: string
  name: string
  username: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
  onPress: (id: string) => void
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  avatarUrl,
  name,
  username,
  lastMessage,
  timestamp,
  unreadCount = 0,
  onPress,
}) => (
  <TouchableOpacity style={styles.container} onPress={() => onPress(id)}>
    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
    <View style={styles.content}>
      <View style={styles.row}>
        <Text style={styles.name}>{name || username}</Text>
        <Text style={styles.time}>{timestamp}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage}
        </Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBubble}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.background,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 16, fontWeight: '600', color: theme.colors.background },
  time: { fontSize: 12, color: theme.colors.background },
  lastMessage: { flex: 1, fontSize: 14, color: theme.colors.background },
  unreadBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: { color: theme.colors.background, fontSize: 12 },
})
