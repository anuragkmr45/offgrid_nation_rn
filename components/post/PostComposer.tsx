// components/post/PostComposer.tsx

import { theme } from '@/constants/theme'
import { debounce } from '@/utils/debounce'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Toast from 'react-native-toast-message'

export interface PostComposerProps {
  onPost: (text: string) => void
  onCameraTap: () => void
  onGalleryTap: () => void
  onLocationTap?: () => void
  mediaUris: string[]
  location?: string | null
  isPosting: boolean
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onPost,
  onCameraTap,
  onGalleryTap,
  onLocationTap,
  mediaUris,
  location,
  isPosting,
}) => {
  const [text, setText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const maxChars = 400

  useEffect(() => {
    setCharCount(text.length)
  }, [text])

  const handlePost = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      Alert.alert('Cannot post empty text.')
      return
    }
    if (trimmed.length > maxChars) {
      Alert.alert('Post too long.')
      return
    }
    onPost(trimmed)
  }

  const debouncedTextChange = debounce((t: string) => setText(t), 100)

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What do you want to tell everyone?"
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.input}
        multiline
        maxLength={maxChars}
        editable={!isPosting}
        onChangeText={debouncedTextChange}
      />

      <View style={styles.bottomRow}>
        <Text style={styles.counter}>
          {charCount}/{maxChars}
        </Text>

        <View style={styles.iconRow}>
          {/* Camera */}
          <TouchableOpacity onPress={() => {
            if (mediaUris.length >= 5) {
              Toast.show({ type: 'error', text1: 'You can only add up to 5 items.' })
            } else {
              onCameraTap()
            }
          }} disabled={isPosting} style={[styles.iconButton, mediaUris.length >= 5 && styles.disabledIcon,]}>
            <Ionicons name="camera-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity onPress={() => {
            if (mediaUris.length >= 5) {
              Toast.show({ type: 'error', text1: 'You can only add up to 5 items.' })
            } else {
              onGalleryTap()
            }
          }} disabled={isPosting} style={[styles.iconButton, mediaUris.length >= 5 && styles.disabledIcon,]}>
            <Ionicons name="images-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* Location */}
          {onLocationTap && <TouchableOpacity onPress={onLocationTap} disabled={isPosting} style={styles.iconButton}>
            <Ionicons name="location-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>}

          {/* Post */}
          <TouchableOpacity
            onPress={handlePost}
            disabled={isPosting || !text.trim()}
            style={[
              styles.postButton,
              (isPosting || !text.trim()) && styles.postDisabled,
            ]}
          >
            <Text
              style={[
                styles.postText,
                (isPosting || !text.trim()) && styles.postTextDisabled,
              ]}
            >
              {isPosting ? 'Posting…' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {location ? <Text style={styles.locationText}>{location}</Text> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    margin: 16,
    borderRadius: theme.borderRadius,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    minHeight: 80,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.bodyLarge,
    textAlignVertical: 'top',
  },
  bottomRow: {
    marginTop: 'auto',
  },
  counter: {
    alignSelf: 'flex-end',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.bodyMedium,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  postButton: {
    marginLeft: 'auto',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  postText: {
    color: theme.colors.background,
    fontWeight: "700",
  },
  postTextDisabled: {
    color: theme.colors.background + 'aa',
  },
  locationText: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.bodyMedium,
  },
  disabledIcon: {
    opacity: 0.5,
  },
})
