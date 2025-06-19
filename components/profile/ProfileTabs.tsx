import { theme } from '@/constants/theme'
import React, { useState } from 'react'
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'
import { FollowersList } from './FollowersList'
import { PostsGrid } from './PostsGrid'

interface Props {
  followers: any[]
  following: any[]
  posts:     any[]
  onUserPress: (username:string)=>void
  onPostPress: (id:string)=>void
}

export const ProfileTabs: React.FC<Props> = ({
  followers, following, posts,
  onUserPress, onPostPress,
}) => {
  const layout = Dimensions.get('window')
  const [index, setIndex] = useState(0)
  const routes = [
    { key:'following', title:`Following ${following.length}` },
    { key:'posts',     title:`Posts ${posts.length}` },
    { key:'followers', title:`Followers ${followers.length}` },
  ]

  const renderScene = SceneMap({
    following: () => <FollowersList data={following} onUserPress={onUserPress} />,
    posts:     () => <PostsGrid     data={posts}     onPostPress={onPostPress} />,
    followers: () => <FollowersList data={followers} onUserPress={onUserPress} />,
  })

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => {
        return (
          <View style={styles.tabBarContainer}>
            {props.navigationState.routes.map((route, idx) => {
              const active = idx === props.navigationState.index
              return (
                <TouchableOpacity
                  key={route.key}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                  onPress={() => props.jumpTo(route.key)}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      active ? styles.tabLabelActive : null,
                    ]}
                  >
                    {route.title}
                  </Text>
                  {active && <View style={styles.indicator} />}
                </TouchableOpacity>
              )
            })}
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection:   'row',
    backgroundColor: theme.colors.primary,
  },
  tabItem: {
    flex:            1,
    alignItems:      'center',
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize:   theme.fontSizes.bodyMedium,
    color:      theme.colors.background,
    fontWeight: "600",
  },
  tabLabelActive: {
    fontWeight: "700",
  },
  indicator: {
    marginTop:     4,
    height:        3,
    width:         '60%',
    backgroundColor: theme.colors.background,
    borderRadius:  2,
  },
})
