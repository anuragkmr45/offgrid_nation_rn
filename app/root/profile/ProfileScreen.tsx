// // app/root/profile/ProfileScreen.tsx

// import React from 'react'
// import { useRouter } from 'expo-router'
// import { ProfileScreen } from '@/components/profile/ProfileScreen'
// import { useProfile } from '@/features/profile/hooks/useProfile'

// export default function MyProfileRoute() {
//   const router = useRouter()

//   // no param => load "me"
// //   const { loading, user, followers, following, posts } = useProfile()

//   return (
//     <ProfileScreen
//       loading={loading}
//       user={user}
//       followers={followers}
//       following={following}
//       posts={posts}
//       isSelf={true}

//       // when editable, tap avatar or fields to edit
//       onAvatarEdit={() => router.push('/root/profile/edit')}
//       onFieldEdit={field => router.push(`/root/profile/edit?field=${field}`)}

//       // tapping other users in your own profile's followers/following
//       onUserPress={u => router.push(`/root/profile/${u}`)}
//       onPostPress={id => router.push(`/root/post/${id}`)}
//     />
//   )
// }

// app/root/profile/ProfileScreen.tsx

// app/root/profile/index.tsx

import { ProfileScreen } from '@/components/profile/ProfileScreen'
import { useRouter } from 'expo-router'
import React from 'react'

// ----- Dummy data for UI only -----
const dummyUser = {
  username:        'john_doe',
  fullName:        'John Doe',
  bio:             'Just a React Native enthusiast who loves off-grid adventures and coding!',
  profilePicture:  'https://ui-avatars.com/api/?name=John+Doe',
}
const dummyFollowers = [
  { username: 'alice',    fullName: 'Alice A.',    profilePicture: 'https://ui-avatars.com/api/?name=Alice' },
  { username: 'bob',      fullName: 'Bob B.',      profilePicture: 'https://ui-avatars.com/api/?name=Bob'   },
]
const dummyFollowing = [
  { username: 'charlie',  fullName: 'Charlie C.',  profilePicture: 'https://ui-avatars.com/api/?name=Charlie' },
  { username: 'dana',     fullName: 'Dana D.',     profilePicture: 'https://ui-avatars.com/api/?name=Dana'    },
]
const dummyPosts = [
  { id: 'p1', media: ['https://placekitten.com/400/400'], content: 'Cute kitty!' },
  { id: 'p2', media: ['https://placebear.com/400/400'], content: 'Grizzly vibes.'  },
]

export default function MyProfileRoute() {
  const router = useRouter()

  return (
    <ProfileScreen
      loading={false}
      user={dummyUser}
      followers={dummyFollowers}
      following={dummyFollowing}
      posts={dummyPosts}
      isSelf={true}

      onAvatarEdit={() => router.push('/root/profile/edit')}
      onFieldEdit={(field) => router.push(`/root/profile/edit?field=${field}`)}

      onUserPress={(u) => router.push(`/root/profile/${u}`)}
      onPostPress={(id) => router.push(`/root/post/${id}`)}
    />
  )
}

