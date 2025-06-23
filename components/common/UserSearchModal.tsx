// components/common/UserSearchModal.tsx
import { useSearchUsersQuery } from '@/features/chat/api/chatApi'
import { debounce } from '@/utils/debounce'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SearchBar } from '.'
import { theme } from '../../constants/theme'
import { ChatUser, UserCard } from '../chat/UserCard'
import { BottomSheet } from './BottomSheet'

interface UserSearchModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (user: ChatUser) => void
  placeholder?: string
  height?: number | string
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  visible,
  onClose,
  onSelect,
  placeholder = 'Search users…',
  height = '60%',
}) => {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')

  // debounce updating the actual `search` term
  const debounced = useMemo(
    () => debounce((val: string) => setSearch(val), 300),
    []
  )

  useEffect(() => {
    return () => {
      debounced.cancel()
    }
  }, [debounced])

  const handleChange = useCallback((val: string) => {
    setInput(val)
    debounced(val.trim())
  }, [debounced])

  const { data: users = [] } = useSearchUsersQuery(search, {
    skip: search.length === 0,
  })

  return (
    <BottomSheet visible={visible} onClose={onClose} height={height}>
      <SearchBar
        value={input}
        onChangeText={handleChange}
        placeholder={placeholder}
        style={styles.search}
      />

      <View style={styles.list}>
        {users.map(u => (
          <UserCard key={u._id} user={u} onPress={onSelect} />
        ))}
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: theme.colors.textPrimary,
    borderRadius: 15,
    margin: 12,
  },
  list: {
    paddingHorizontal: 12,
  },
})
