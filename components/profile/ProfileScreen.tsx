// components/profile/ProfileScreen.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ProfileHeader } from './ProfileHeader'
import { ProfileTabs } from './ProfileTabs'

interface Props {
  loading: boolean
  user:    any
  followers: any[]
  following: any[]
  posts:     any[]
  isSelf:    boolean
  onAvatarEdit: ()=>void
  onFieldEdit: (f:'username'|'fullName'|'bio')=>void
  onUserPress: (username:string)=>void
  onPostPress: (id:string)=>void
}

export const ProfileScreen: React.FC<Props> = ({
  loading, user,
  followers, following, posts,
  isSelf, onAvatarEdit, onFieldEdit,
  onUserPress, onPostPress,
}) => {
  if (loading) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator size="large" color={theme.colors.primary}/>
      </SafeAreaView>
    )
  }
  if (!user) {
    return (
      <SafeAreaView style={s.center}>
        <Text style={{color:theme.colors.textPrimary}}>Profile not found.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <ProfileHeader
          fullName={user.fullName}
          username={user.username}
          bio={user.bio}
          avatarUrl={user.profilePicture}
          isEditable={isSelf}
          onAvatarEdit={onAvatarEdit}
          onFieldEdit={onFieldEdit}
        />

        <ProfileTabs
          followers={followers}
          following={following}
          posts={posts}
          onUserPress={onUserPress}
          onPostPress={onPostPress}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  center:{ flex:1,justifyContent:'center',alignItems:'center' }
})
