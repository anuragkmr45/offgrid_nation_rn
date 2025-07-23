// components/common/UserSearchModal.tsx
import { useChat } from '@/features/chat/hooks/useChat'
import { debounce } from '@/utils/debounce'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Loader, SearchBar } from '.'
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

  const { users, userSearchLoading, userSearchError, setSearchTerm } = useChat()
  const debounced = useMemo(() => debounce((val: string) => setSearchTerm(val.trim()), 300), [setSearchTerm])

  useEffect(() => {
    return () => {
      debounced.cancel()
    }
  }, [debounced])

  const handleChange = useCallback((val: string) => {
    setInput(val)
    debounced(val.trim())
  }, [debounced])

  return (
    <BottomSheet visible={visible} onClose={onClose} height={height}>
      <SearchBar
        value={input}
        onChangeText={handleChange}
        placeholder={placeholder}
        style={styles.search}
      />

      {userSearchError ? (
        <Text style={styles.errorText}>Something went wrong — pull to retry</Text>
      ) : userSearchLoading ? (
        <Loader />
      ) : (
        <View style={styles.list}>
          {users.map(u => (
            <UserCard key={u._id} user={u} onPress={onSelect} />
          ))}
        </View>
      )
      }
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
  errorText: {
    color: 'crimson',
    fontSize: 14,
  },
})
