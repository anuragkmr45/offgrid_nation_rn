// app/search/index.tsx

import { SearchBar } from '@/components/common'
import { WithLayout } from '@/components/layouts/WithLayout'
import {
  AccountCard
} from '@/components/search/AccountCard'
import { SearchTabs } from '@/components/search/SearchTabs'
import {
  TopicCard,
  TopicCardProps,
} from '@/components/search/TopicCard'
import { theme } from '@/constants/theme'
import { useSearchUsers } from '@/features/list/hooks/useList'
import { debounce } from '@/utils/debounce'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

// Static topics to show in the Topics tab
const TOPICS: TopicCardProps[] = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    title: 'Nature',
    onPress: () => console.log('Topic: Nature'),
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    title: 'Technology',
    onPress: () => console.log('Topic: Technology'),
  },
  // …add more as needed
]

export default function SearchScreen() {
  const router = useRouter()

  // immediate text from the input
  const [query, setQuery] = useState<string>('')

  // debounced version, used to drive the API call
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')

  // create the debounced setter once
  const debouncedSet = useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), 300),
    []
  )

  // whenever `query` changes, schedule an update to debouncedQuery
  useEffect(() => {
    debouncedSet(query)
    return () => {
      debouncedSet.cancel()
    }
  }, [query])

  // RTK Query hook: skips when debouncedQuery is empty
  const { users, isLoading: usersLoading } = useSearchUsers(
    debouncedQuery
  )

  // 0 = Accounts, 1 = Topics
  const [selectedTab, setTab] = useState<number>(0)

  return (
    <WithLayout
      statusBarStyle="dark-content"
      headerBgColor={theme.colors.primary}
      statusBarBgColor={theme.colors.primary}
    >
      <StatusBar backgroundColor={theme.colors.background} animated />

      {/* Search input */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search users or topics…"
        style={styles.search}
      />

      {/* Tabs */}
      <SearchTabs
        options={['Accounts', 'Topics']}
        selectedIndex={selectedTab}
        onSelect={setTab}
      />

      {/* Content */}
      <View style={styles.container}>
        {selectedTab === 0 ? (
          // ---- ACCOUNTS TAB ----
          debouncedQuery.length === 0 ? (
            // 1) no query yet
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Start typing to search users…
              </Text>
            </View>
          ) : usersLoading ? (
            // 2) loading
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.emptyContainer}
            />
          ) : users.length === 0 ? (
            // 3) no results
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          ) : (
            // 4) render list
            <FlatList
              data={users}
              keyExtractor={(u) => u._id}
              renderItem={({ item }) => (
                <AccountCard
                  avatarUrl={item.profilePicture}
                  fullName={item.fullName || item.username}
                  handle={`@${item.username}`}
                  isFollowing={item.isFollowing}
                  onToggleFollow={(next) =>
                    console.log(item.username, next)
                  }
                />
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 8 }} />
              )}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )
        ) : (
          // ---- TOPICS TAB ----
          <FlatList
            data={TOPICS.filter((t) =>
              t.title.toLowerCase().includes(query.toLowerCase())
            )}
            keyExtractor={(t) => t.title}
            renderItem={({ item }) => <TopicCard {...item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          />
        )}
      </View>
    </WithLayout>
  )
}

const styles = StyleSheet.create({
  search: {
    marginHorizontal: 1,
    marginVertical: 8,
  },
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: theme.colors.primary,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.bodyLarge,
    fontWeight: "600",
  },
})
