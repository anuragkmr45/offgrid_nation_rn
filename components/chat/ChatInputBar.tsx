// components/chat/ChatInputBar.tsx
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { theme } from '../../constants/theme'

export interface ChatInputBarProps {
  onSend: (text: string) => void
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend }) => {
  const [text, setText] = useState('')
  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Send a message…"
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity onPress={handleSend} style={styles.button}>
        <Ionicons name="send" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: theme.colors.textPrimary,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.textPrimary,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
})
