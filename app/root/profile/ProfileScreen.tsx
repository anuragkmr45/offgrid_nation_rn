import { ProfileScreen } from '@/components/profile/ProfileScreen'
import { theme } from '@/constants/theme'
import { usePost } from '@/features/content/post/hooks/usePost'
import { useFollowers, useFollowing } from '@/features/list/hooks/useList'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StatusBar, Text, View } from 'react-native'

export default function MyProfileRoute() {
  const router = useRouter()
  const { myProfile, isLoadingProfile, refetch } = useProfile()
  const { followers } = useFollowers(myProfile?.username || "");
  const { following } = useFollowing(myProfile?.username || "");
  const {list} = usePost(myProfile?.username || "");

  // Show loading
  if (isLoadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    )
  }

  // Show error fallback if profile failed to load
  if (!myProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load profile. Please try again.</Text>
      </View>
    )
  }

  return (
    <>
    <StatusBar animated backgroundColor={theme.colors.primary} barStyle={'light-content'} />
    <ProfileScreen
      loading={false}
      user={myProfile || []}
      followers={followers || []}
      following={following || []}
      posts={list || []}
      isSelf={true}
      onAvatarEdit={() => router.push('/root/profile/edit')}
      onFieldEdit={(field) => router.push(`/root/profile/edit?field=${field}`)}
      onUserPress={(u) => router.push(`/root/profile/${u}`)}
      onPostPress={(id) => router.push(`/root/post/${id}`)}
    />
    </>
  )
}
