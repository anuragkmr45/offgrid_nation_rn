// components/chat/ChatList.tsx
import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { ChatListItem, ChatListItemProps } from './ChatListItem'

// define a data-only shape (everything except onPress)
export type ChatListData = Omit<ChatListItemProps, 'onPress'>

export interface ChatListProps {
  data: ChatListData[]
  onItemPress: (item: ChatListData) => void
}

export const ChatList: React.FC<ChatListProps> = ({ data, onItemPress }) => {
  const renderItem: ListRenderItem<ChatListData> = ({ item }) => (
    <ChatListItem
      {...item}
      onPress={() => onItemPress(item)}
    />
  )
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={renderItem}
    />
  )
}
