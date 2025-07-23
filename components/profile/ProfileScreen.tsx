// components/profile/ProfileScreen.tsx

import { AVATAR_FALLBACK } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../common/Header'
import { EditProfileModal } from './EditProfileModal'
import { ProfileHeader } from './ProfileHeader'
import { ProfileTabs } from './ProfileTabs'

interface Props {
  loading: boolean
  user: any
  followers: any[]
  following: any[]
  posts: any[]
  isSelf: boolean
  onAvatarEdit: () => void
  onFieldEdit: (f: 'username' | 'fullName' | 'bio') => void
  onUserPress: (username: string) => void
}

export const ProfileScreen: React.FC<Props> = ({
  loading, user,
  followers, following, posts,
  isSelf, onAvatarEdit, onFieldEdit,
  onUserPress,
}) => {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const { _id, username = "", fullName = "", bio = "", profilePicture = "", followersCount = 0, followingCount = "", postsCount = 0, isFollowing } = user || {}

  if (loading) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    )
  }
  if (!user) {
    return (
      <SafeAreaView style={s.center}>
        <Text style={{ color: theme.colors.textPrimary }}>Profile not found.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={s.container}>
      <Header backgroundColor={theme.colors.primary} onBack={() => { router.back() }} titleColor={theme.colors.background} iconColor={theme.colors.background} title={fullName || username} />
      <FlatList
        data={[{ key: 'dummy' }]}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <ProfileHeader
              userId={_id}
              fullName={fullName ?? "OffgridUser"}
              username={username ?? ""}
              bio={bio ?? ""}
              isFollowing={isFollowing || false}
              avatarUrl={profilePicture ?? AVATAR_FALLBACK}
              isEditable={isSelf || false}
              onAvatarEdit={() => setShowEditModal(true)}
              onFieldEdit={() => setShowEditModal(true)}
            />
            <ProfileTabs
              username={username ?? ""}
              avatarUrl={profilePicture ?? AVATAR_FALLBACK}
              followerCount={followersCount || 0}
              followingCount={followingCount || 0}
              postCount={postsCount || 0}
              followers={followers}
              following={following}
              posts={posts}
              onUserPress={onUserPress}
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 80, backgroundColor: theme.colors.primary }}
        showsVerticalScrollIndicator={false}
      />
      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialName={user.fullName}
        initialBio={user.bio}
        initialPicture={user.profilePicture}
      />

    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
