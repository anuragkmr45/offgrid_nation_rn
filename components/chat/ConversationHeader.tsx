// components/chat/ConversationHeader.tsx
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { theme } from '../../constants/theme'

export interface ConversationHeaderProps {
  avatarUrl: string
  name: string
  statusText?: string
  onBack: () => void
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  avatarUrl,
  name,
  statusText,
  onBack,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onBack} style={styles.back}>
      <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
    </TouchableOpacity>
    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
    <View>
      <Text style={styles.name}>{name}</Text>
      {statusText && <Text style={styles.status}>{statusText}</Text>}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    // borderColor: theme.colors.,
  },
  back: { marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  name: { fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary },
  status: { fontSize: 12, color: theme.colors.textSecondary },
})
