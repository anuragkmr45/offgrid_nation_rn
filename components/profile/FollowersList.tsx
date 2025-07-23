// components/profile/FollowersList.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { AccountCard } from '../search/AccountCard'

interface User {
  username: string
  fullName?: string
  profilePicture?: string
  isFollowing?: boolean
}

interface Props {
  data: User[]
}

export const FollowersList: React.FC<Props> = ({ data }) => {
  if (!data.length) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.primary }}><Text style={styles.empty}>No followers.</Text></View>
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <FlatList
        data={data}
        keyExtractor={u => u.username}
        renderItem={({ item }) => (
          <AccountCard avatarUrl={item.profilePicture || ""} fullName={item.fullName || ""} handle={item.username || ""} isFollowing={item.isFollowing} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center', marginTop: 32,
    color: theme.colors.background
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: theme.fontSizes.bodyLarge, fontWeight: '600' },
  handle: { color: theme.colors.textSecondary },
  btn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16
  },
  btnText: {
    color: theme.colors.background,
    fontWeight: '600'
  },
  separator: { height: 1, backgroundColor: '#ddd', marginVertical: 4 }
})
