// components/profile/PostsGrid.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'

interface Post {
  id: string
  media: string[]
  content: string
}

interface Props {
  data: Post[]
  onPostPress: (id:string)=>void
}

export const PostsGrid: React.FC<Props> = ({ data, onPostPress }) => {
  if (!data.length) {
    return <Text style={styles.empty}>No posts yet.</Text>
  }

  const numCols = 2
  const size = (Dimensions.get('window').width - 48)/numCols

  return (
    <FlatList
      data={data}
      keyExtractor={p=>p.id}
      numColumns={numCols}
      contentContainerStyle={styles.grid}
      renderItem={({item})=>(
        <TouchableOpacity
          style={{ margin:8 }}
          onPress={()=>onPostPress(item.id)}
        >
          <Image
            source={{uri:item.media[0]}}
            style={{ width:size, height:size, borderRadius:theme.borderRadius }}
          />
        </TouchableOpacity>
      )}
    />
  )
}

const styles = StyleSheet.create({
  empty: {
    textAlign:'center',marginTop:32,
    color:theme.colors.textSecondary
  },
  grid: {
    paddingHorizontal:16
  }
})
