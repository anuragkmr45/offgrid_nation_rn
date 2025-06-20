// components/profile/ProfileScreen.tsx

import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MarketplaceHeader } from '../marketplace/MarketplaceHeader'
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
  onPostPress: (id: string) => void
}

export const ProfileScreen: React.FC<Props> = ({
  loading, user,
  followers, following, posts,
  isSelf, onAvatarEdit, onFieldEdit,
  onUserPress, onPostPress,
}) => {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)

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
      <MarketplaceHeader backgroundColor={theme.colors.primary} onBack={() => { router.back() }} title={user.fullName || user.username} />
      <FlatList
        data={[{ key: 'dummy' }]}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <ProfileHeader
              fullName={user.fullName || "Update full name"}
              username={user.username || ""}
              bio={user.bio}
              avatarUrl={user.profilePicture}
              isEditable={isSelf}
              onAvatarEdit={() => setShowEditModal(true)}
              onFieldEdit={() => setShowEditModal(true)}
            />
            <ProfileTabs
              followerCount={user.followersCount || 0}
              followingCount={user.followingCount || 0}
              postCount={user.postsCount || 0}
              followers={followers}
              following={following}
              posts={posts}
              onUserPress={onUserPress}
              onPostPress={onPostPress}
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
