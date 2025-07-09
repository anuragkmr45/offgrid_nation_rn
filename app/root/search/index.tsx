// app/search/index.tsx

import { SearchBar, SelectDropdown } from '@/components/common'
import { PostCard } from '@/components/common/feeds/PostCard'
import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { WithLayout } from '@/components/layouts/WithLayout'
import {
  AccountCard
} from '@/components/search/AccountCard'
import { SearchTabs } from '@/components/search/SearchTabs'
import { theme } from '@/constants/theme'
import { usePost } from '@/features/content/post/hooks/usePost'
import { useSearchUsers } from '@/features/list/hooks/useList'
import { debounce } from '@/utils/debounce'
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
const TOPICS = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    title: 'Nature',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    title: 'Technology',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    title: 'Test',
  },
]

export default function SearchScreen() {
  const { search, isSearching, searchData } = usePost()
  const [selectedTopic, setSelectedTopic] = useState<string[]>([])

  // immediate text from the input
  const [query, setQuery] = useState<string>('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  // debounced version, used to drive the API call
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')

  // create the debounced setter once
  const debouncedSet = useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), 300),
    []
  )

  const topicOptions = TOPICS.map((t) => ({
    label: t.title,
    value: t.title.toLowerCase(),
  }))

  const handleTopicSelect = (topicValue: string) => {
    search(topicValue)
  }

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

  const mappedPosts = searchData?.posts.map((p) => ({
    postId: p._id,
    user: {
      avatar: p.userId.profilePicture || '',
      username: p.userId.username,
    },
    timestamp: new Date(p.createdAt).toLocaleDateString(), // You can format with timeAgo if needed
    media: p.media.map((url, idx) => ({ id: `${p._id}-${idx}`, url })),
    caption: p.content,
    isLiked: p.isLiked,
    commentsCount: p.commentsCount,
    likesCount: p.likesCount,
  })) || []


  return (
    <WithLayout
      statusBarStyle="dark-content"
      headerBgColor={theme.colors.primary}
      statusBarBgColor={theme.colors.primary}
    >
      <StatusBar backgroundColor={theme.colors.background} animated />
      <ProtectedLayout>
        {selectedTab === 0 ? (
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search users…"
            style={styles.search}
          />
        ) : (
          <SelectDropdown
            options={topicOptions}
            selectedValues={selectedTopic}
            onChange={setSelectedTopic}
            onSelect={handleTopicSelect}
            multiple={false}
            searchable={false}
            placeholder="Select a topic"
          />
        )}


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
            isSearching ? (
              <View style={{}}>
                <ActivityIndicator size="large" color={theme.colors.background} />
              </View>
            ) : (
              <FlatList
                data={mappedPosts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard post={item} cardHeight={500} />}
                contentContainerStyle={{ paddingVertical: 12 }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No posts found for this topic.</Text>
                  </View>
                }
              />
            )

          )}
        </View>
      </ProtectedLayout>
    </WithLayout >
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
