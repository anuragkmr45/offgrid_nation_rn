import { AVATAR_FALLBACK } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Toast from 'react-native-toast-message'
import { Button, CustomModal } from '../common'
import { FollowUnfollowButton } from '../common/FollowUnfollow'

interface Props {
  userId: string
  isFollowing: boolean
  fullName?: string
  username: string
  bio?: string
  avatarUrl?: string
  isEditable: boolean
  onAvatarEdit: () => void
  onFieldEdit: (field: 'fullName' | 'username' | 'bio') => void
}

export const ProfileHeader: React.FC<Props> = ({
  fullName = '', username, bio = '',
  avatarUrl, isEditable,
  onAvatarEdit, onFieldEdit, userId, isFollowing
}) => {
  const [showFullBio, setShowFullBio] = useState(false)
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)

  const router = useRouter()
  const displayedBio = bio.length > 50 && !showFullBio ? bio.slice(0, 50) + '…' : bio

  const handleMsg = () => {
    if (userId !== "") {
      router.push({
        pathname: '/root/chat/Conversation',
        params: {
          recipientId: userId,
          recipientName: fullName || username,
          profilePicture: avatarUrl || AVATAR_FALLBACK,
        },
      })
    } else {
      Toast.show({ type: 'error', text1: `Unable to start conversation with ${fullName}` })
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.left}>
          {/* Full name */}
          <TouchableOpacity disabled={!isEditable} onPress={() => onFieldEdit('fullName')}>
            <View style={styles.row}>
              <Text style={styles.fullName}>{fullName}</Text>
              {isEditable && (
                <Ionicons
                  name={Platform.OS === 'ios' ? 'pencil' : 'pencil-outline'}
                  size={16} color={theme.colors.textPrimary}
                  style={styles.editIcon}
                />
              )}
            </View>
          </TouchableOpacity>
          {/* Username */}
          <TouchableOpacity disabled={!isEditable} onPress={() => onFieldEdit('username')}>
            <View style={styles.row}>
              <Text style={styles.username}>{username}</Text>
              {/* {isEditable && (
              <Ionicons
                name={Platform.OS === 'ios' ? 'pencil' : 'pencil-outline'}
                size={14} color={theme.colors.textPrimary}
                style={styles.editIcon}
              />
            )} */}
            </View>
          </TouchableOpacity>
          {/* Bio */}
          {bio ? (
            <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
              <Text style={styles.bio}>{displayedBio}</Text>
              {bio.length > 50 && (
                <Text style={styles.readMore}>
                  {showFullBio ? 'Read less' : 'Read more'}
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Avatar + edit badge */}
        <TouchableOpacity disabled={!isEditable} onPress={onAvatarEdit} onLongPress={() => setAvatarModalVisible(true)} delayLongPress={300}>
          <Image
            source={{ uri: avatarUrl || AVATAR_FALLBACK }}
            style={styles.avatar}
          />
          {isEditable && (
            <View style={styles.cameraBadge}>
              <Ionicons
                name={Platform.OS === 'ios' ? 'camera' : 'camera-outline'}
                size={18}
                color={theme.colors.background}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
      {!isEditable && <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 16 }}>
        <FollowUnfollowButton handle={username} isFollowing={isFollowing || false} buttonStyle={{ width: '45%', height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }} />
        <Button onPress={handleMsg} text='Message' textColor={theme.colors.background} debounce icon={''} style={{ borderWidth: 1, borderColor: theme.colors.background, width: '45%', borderRadius: 10 }} />
      </View>}

      <CustomModal
        visible={avatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
        style={{ padding: 0, width: 200 }} // tweak width as you like
      >
        {/* show a larger avatar */}
        <Image
          source={{ uri: avatarUrl || AVATAR_FALLBACK }}
          style={{ width: 180, height: 180, borderRadius: 90, alignSelf: 'center' }}
        />

        {/* Edit button inside the modal */}
        {/* {isEditable && (
          <Button
            text="Edit"
            onPress={() => {
              setAvatarModalVisible(false)
              onAvatarEdit()
            }}
            style={{ marginTop: 16, alignSelf: 'center' }}
            textColor={theme.colors.background}
          />
        )} */}
      </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  left: { flex: 1, paddingRight: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  fullName: {
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: "700",
    color: theme.colors.background,
  },
  username: {
    fontSize: theme.fontSizes.bodyLarge,
    color: theme.colors.background,
    marginTop: 4,
  },
  editIcon: { marginLeft: 4 },
  bio: {
    marginTop: 8,
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.background,
  },
  readMore: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: theme.colors.primary,
    padding: 4, borderRadius: 12,
  },
})
