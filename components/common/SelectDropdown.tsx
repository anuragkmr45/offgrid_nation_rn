import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { theme } from '../../constants/theme'

export type OptionType = {
  label: string
  value: string
}

interface SelectDropdownProps {
  options: OptionType[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
   onSelect?: (value: string) => void
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  multiple = false,
  searchable = false,
  onSelect
}) => {
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState('')

  const toggleSelect = (value: string) => {
    if (multiple) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value))
      } else {
        onChange([...selectedValues, value])
      }
    } else {
      onChange([value])
      setVisible(false)
      onSelect?.(value)
    }
  }

  const renderSelected = () => {
    if (!selectedValues.length) return <Text style={styles.placeholder}>{placeholder}</Text>

    const selectedLabels = options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label)

    return <Text style={styles.selectedText}>{selectedLabels.join(', ')}</Text>
  }

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.selector}>
        {renderSelected()}
        <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            {searchable && (
              <TextInput
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholderTextColor={theme.colors.textSecondary}
              />
            )}
            <ScrollView>
              {filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value)
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={styles.option}
                    onPress={() => toggleSelect(opt.value)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.selected]}>
                      {opt.label}
                    </Text>
                    {multiple && isSelected && (
                      <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginVertical: 10,
    backgroundColor: theme.colors.background,
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  selectedText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 12,
    maxHeight: '70%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: theme.colors.textPrimary,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  selected: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

export default SelectDropdown
