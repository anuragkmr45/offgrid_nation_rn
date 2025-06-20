// components/profile/PostPreviewModal.tsx
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  post: {
    id: string
    media: string[]
    content: string
  } | null
}

export const PostPreviewModal: React.FC<Props> = ({ visible, onClose, post }) => {
  if (!post) return null

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Image source={{ uri: post.media[0] }} style={styles.image} />
          <Text style={styles.content}>{post.content}</Text>
        </View>
      </View>
    </Modal>
  )
}

const screenHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: (screenHeight * 4) / 5,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: theme.borderRadius,
    marginBottom: 12,
  },
  content: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
})
