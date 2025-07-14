import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { ProfileScreen } from '@/components/profile/ProfileScreen'
import { theme } from '@/constants/theme'
import { usePost } from '@/features/content/post/hooks/usePost'
import { useFollowers, useFollowing } from '@/features/list/hooks/useList'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StatusBar, Text, View } from 'react-native'

export default function UserProfileRoute() {
  const { username } = useLocalSearchParams<{ username?: string }>()
  const router = useRouter()

  const { user, loading } = useUserProfile(username)
  const { followers } = useFollowers(username || '')
  const { following } = useFollowing(username || '')
  const { list: posts } = usePost(username || '')

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Fetching {username} profile...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>User not found</Text>
      </View>
    )
  }

  return (
    <ProtectedLayout>
      <StatusBar animated backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <ProfileScreen
        loading={false}
        user={user}
        followers={followers}
        following={following}
        posts={posts}
        isSelf={false}
        onAvatarEdit={() => { }}
        onFieldEdit={() => { }}
        onUserPress={(u) => router.push(`/root/profile/${u}`)}
      />
    </ProtectedLayout>
  )
}

