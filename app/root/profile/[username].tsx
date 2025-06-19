// // app/root/profile/[username].tsx

// import React from 'react'
// import { useRouter, useSearchParams } from 'expo-router'
// import { ProfileScreen } from '@/components/profile/ProfileScreen'
// import { useProfile }    from '@/hooks/useProfile'

// export default function UserProfileRoute() {
//   const { username } = useSearchParams<{ username?: string }>()
//   const router       = useRouter()

//   // pass the username so the hook fetches their data
//   const { loading, user, followers, following, posts } = useProfile(username)

//   return (
//     <ProfileScreen
//       loading={loading}
//       user={user}
//       followers={followers}
//       following={following}
//       posts={posts}
//       isSelf={false}

//       // no edits on other‐user screens
//       onAvatarEdit={() => {}}
//       onFieldEdit={() => {}}

//       onUserPress={u => router.push(`/root/profile/${u}`)}
//       onPostPress={id => router.push(`/root/post/${id}`)}
//     />
//   )
// }

// app/root/profile/[username].tsx

import { ProfileScreen } from '@/components/profile/ProfileScreen'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'


// ----- Dummy data for UI only -----
const dummyFollowers = [
  { username: 'xavier',  fullName: 'Xavier X.',  profilePicture: 'https://ui-avatars.com/api/?name=Xavier' },
  { username: 'yvonne',  fullName: 'Yvonne Y.',  profilePicture: 'https://ui-avatars.com/api/?name=Yvonne' },
]
const dummyFollowing = [
  { username: 'zach',    fullName: 'Zach Z.',    profilePicture: 'https://ui-avatars.com/api/?name=Zach'   },
]
const dummyPosts = [
  { id: 'o1', media: ['https://placebeard.it/400/400'], content: 'Adventures off-grid.' },
]

export default function UserProfileRoute() {
  const { username } = useLocalSearchParams<{ username?: string }>()
  const router = useRouter()

  // reflect the :username param in the header
  const dummyUser = {
    username:       username ?? 'unknown',
    fullName:       `${username} (Guest)`,
    bio:            `This is ${username}ʼs public bio.`,
    profilePicture: `https://ui-avatars.com/api/?name=${username}`,
  }

  return (
    <ProfileScreen
      loading={false}
      user={dummyUser}
      followers={dummyFollowers}
      following={dummyFollowing}
      posts={dummyPosts}
      isSelf={false}

      // no-op edit handlers
      onAvatarEdit={() => {}}
      onFieldEdit={() => {}}

      onUserPress={(u) => router.push(`/root/profile/${u}`)}
      onPostPress={(id) => router.push(`/root/post/${id}`)}
    />
  )
}
