// components/chat/MessageBubble.tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../../constants/theme'

export interface MessageBubbleProps {
  text: string
  timestamp: string
  outgoing?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  timestamp,
  outgoing = false,
}) => {
  const containerStyle = outgoing
    ? styles.bubbleOutgoing
    : styles.bubbleIncoming
  const textStyle = outgoing
    ? styles.textOutgoing
    : styles.textIncoming

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={textStyle}>{text}</Text>
      <Text style={styles.time}>{timestamp}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '75%',
    marginVertical: 4,
    padding: 8,
    borderRadius: 12,
  },
  bubbleIncoming: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleOutgoing: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textIncoming: {
    color: theme.colors.textPrimary,
  },
  textOutgoing: {
    color: theme.colors.background,
  },
  time: {
    fontSize: 10,
    color: theme.colors.textPrimary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
})
