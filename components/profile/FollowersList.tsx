// components/profile/FollowersList.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

interface User {
  username: string
  fullName?: string
  profilePicture?: string
}

interface Props {
  data: User[]
  onUserPress: (username:string)=>void
}

export const FollowersList: React.FC<Props> = ({ data, onUserPress }) => {
  if (!data.length) {
    return <Text style={styles.empty}>No followers.</Text>
  }
  return (
    <FlatList
      data={data}
      keyExtractor={u=>u.username}
      renderItem={({item})=>(
        <TouchableOpacity
          style={styles.row}
          onPress={()=>onUserPress(item.username)}
        >
          <Image
            source={{uri: item.profilePicture || `https://ui-avatars.com/api/?name=${item.username}`}}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{item.fullName||item.username}</Text>
            <Text style={styles.handle}>@{item.username}</Text>
          </View>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Follow</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={()=> <View style={styles.separator}/> }
    />
  )
}

const styles = StyleSheet.create({
  empty: {
    textAlign:'center', marginTop:32,
    color: theme.colors.textSecondary
  },
  row: {
    flexDirection:'row', alignItems:'center',
    paddingHorizontal:16, paddingVertical:8
  },
  avatar: { width:40, height:40, borderRadius:20 },
  info: { flex:1, marginLeft:12 },
  name: { fontSize: theme.fontSizes.bodyLarge, fontWeight:'600' },
  handle:{ color: theme.colors.textSecondary },
  btn:{
    backgroundColor: theme.colors.primary,
    paddingHorizontal:12, paddingVertical:6,
    borderRadius:16
  },
  btnText:{
    color: theme.colors.background,
    fontWeight:'600'
  },
  separator:{ height:1, backgroundColor:'#ddd', marginVertical:4 }
})
