// components/chat/UserCard.tsx
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { theme } from '../../constants/theme'

// NOTE: conversationId is now optional
export interface ChatUser {
  _id: string
  conversationId?: string | null
  fullName: string
  profilePicture: string
  username: string
}

interface UserCardProps {
  user: ChatUser
  onPress: (user: ChatUser) => void
}

export const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(user)}>
    <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
    <View style={styles.info}>
      <View style={styles.topRow}>
        <Text style={styles.username}>{user.username}</Text>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color={theme.colors.textPrimary}
        />
      </View>
      {!!user.fullName && (
        <Text style={styles.fullName}>{user.fullName}</Text>
      )}
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textPrimary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  fullName: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
})
