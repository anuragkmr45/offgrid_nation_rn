import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

interface Props {
  fullName?: string
  username:  string
  bio?:      string
  avatarUrl?: string
  isEditable: boolean
  onAvatarEdit: () => void
  onFieldEdit: (field: 'fullName'|'username'|'bio') => void
}

export const ProfileHeader: React.FC<Props> = ({
  fullName='', username, bio='',
  avatarUrl, isEditable,
  onAvatarEdit, onFieldEdit,
}) => {
  const [showFullBio, setShowFullBio] = useState(false)

  const displayedBio =
    bio.length > 50 && !showFullBio ? bio.slice(0,50) + '…' : bio

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {/* Full name */}
        <TouchableOpacity disabled={!isEditable} onPress={()=>onFieldEdit('fullName')}>
          <View style={styles.row}>
            <Text style={styles.fullName}>{fullName}</Text>
            {isEditable && (
              <Ionicons
                name={Platform.OS==='ios'?'pencil':'pencil-outline'}
                size={16} color={theme.colors.textPrimary}
                style={styles.editIcon}
              />
            )}
          </View>
        </TouchableOpacity>
        {/* Username */}
        <TouchableOpacity disabled={!isEditable} onPress={()=>onFieldEdit('username')}>
          <View style={styles.row}>
            <Text style={styles.username}>@{username}</Text>
            {isEditable && (
              <Ionicons
                name={Platform.OS==='ios'?'pencil':'pencil-outline'}
                size={14} color={theme.colors.textPrimary}
                style={styles.editIcon}
              />
            )}
          </View>
        </TouchableOpacity>
        {/* Bio */}
        {bio ? (
          <TouchableOpacity onPress={()=>setShowFullBio(!showFullBio)}>
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
      <TouchableOpacity disabled={!isEditable} onPress={onAvatarEdit}>
        <Image
          source={{uri: avatarUrl || `https://ui-avatars.com/api/?name=${username}`}}
          style={styles.avatar}
        />
        {isEditable && (
          <View style={styles.cameraBadge}>
            <Ionicons
              name={Platform.OS==='ios'?'camera':'camera-outline'}
              size={18}
              color={theme.colors.background}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    padding:16,
    backgroundColor: theme.colors.primary,
  },
  left: { flex:1, paddingRight:12 },
  row: { flexDirection:'row', alignItems:'center' },
  fullName: {
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: "700",
    color: theme.colors.background,
  },
  username: {
    fontSize: theme.fontSizes.bodyLarge,
    color: theme.colors.background,
    marginTop:4,
  },
  editIcon: { marginLeft:4 },
  bio: {
    marginTop:8,
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.background,
  },
  readMore: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop:4,
  },
  avatar: { width:80, height:80, borderRadius:40 },
  cameraBadge: {
    position:'absolute', bottom:0, right:0,
    backgroundColor: theme.colors.primary,
    padding:4, borderRadius:12,
  },
})
