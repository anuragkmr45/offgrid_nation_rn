import { theme } from '@/constants/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FollowersList } from './FollowersList'
import { PostsGrid } from './PostsGrid'

interface Props {
  followerCount: number
  followingCount: number
  postCount: number
  followers: any[]
  following: any[]
  posts: any[]
  onUserPress: (username: string) => void
  onPostPress: (id: string) => void
}

export const ProfileTabs: React.FC<Props> = ({
  followerCount,
  followingCount,
  postCount,
  followers,
  following,
  posts,
  onUserPress,
  onPostPress,
}) => {
  const [activeTab, setActiveTab] = useState<'following' | 'posts' | 'followers'>('following')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'following':
        return <FollowersList data={following} />
      case 'posts':
        return <PostsGrid data={posts} onPostPress={onPostPress} />
      case 'followers':
        return <FollowersList data={followers} />
      default:
        return <Text style={styles.empty}>Invalid tab</Text>
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabBar}>
        <TabButton
          title={`Following (${following.length})`}
          active={activeTab === 'following'}
          onPress={() => setActiveTab('following')}
        />
        <TabButton
          title={`Posts (${posts.length})`}
          active={activeTab === 'posts'}
          onPress={() => setActiveTab('posts')}
        />
        <TabButton
          title={`Followers (${followers.length})`}
          active={activeTab === 'followers'}
          onPress={() => setActiveTab('followers')}
        />
      </View>
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </View>
  )
}

const TabButton = ({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.tabButton}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{title}</Text>
    {active && <View style={styles.activeIndicator} />}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  tabText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.bodyMedium,
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
  activeIndicator: {
    marginTop: 6,
    height: 3,
    width: '60%',
    backgroundColor: theme.colors.background,
    borderRadius: 2,
  },
  tabContent: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: theme.colors.primary,
    minHeight: "100%"
  },
  empty: {
    textAlign: 'center',
    marginTop: 16,
    color: theme.colors.textSecondary,
  },
})