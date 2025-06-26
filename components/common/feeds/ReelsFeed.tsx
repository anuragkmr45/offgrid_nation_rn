import React, { useRef, useState } from 'react'
import {
    Dimensions,
    FlatList,
    View,
    ViewToken
} from 'react-native'
import { PostCard, PostType } from './PostCard'

interface ReelsFeedProps {
  posts: PostType[]
}

const SCREEN_HEIGHT = Dimensions.get('window').height

export const ReelsFeed: React.FC<ReelsFeedProps> = ({ posts }) => {
  const [visibleIndex, setVisibleIndex] = useState(0)

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setVisibleIndex(viewableItems[0].index ?? 0)
      }
    }
  ).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.postId}
      pagingEnabled
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View style={{ height: SCREEN_HEIGHT }}>
          <PostCard post={item} isVisible={index === visibleIndex} />
        </View>
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  )
}
