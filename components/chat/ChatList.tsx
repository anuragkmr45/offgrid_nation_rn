// components/chat/ChatList.tsx
import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { ChatListItem, ChatListItemProps } from './ChatListItem'

export interface ChatListProps {
  data: any[]
  onItemPress: (id: string) => void
}

export const ChatList: React.FC<ChatListProps> = ({ data, onItemPress }) => {
  const renderItem: ListRenderItem<ChatListItemProps> = ({ item }) => (
    <ChatListItem {...item} onPress={onItemPress} />
  )
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={renderItem}
    />
  )
}
