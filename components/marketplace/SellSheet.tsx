// app/marketplace/components/SellSheet.tsx
import { BottomSheet } from '@/components/common/BottomSheet'
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  onAddProduct: () => void
}

export const SellSheet: React.FC<Props> = ({ visible, onClose, onAddProduct }) => (
  <BottomSheet visible={visible} onClose={onClose} height={200}>
    <Text style={{ fontSize: theme.fontSizes.headlineSmall, fontWeight: '700', marginBottom: 16 }}>
      Create your listing
    </Text>
    <TouchableOpacity onPress={onAddProduct} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.textSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      }}>
        <Ionicons name="add" size={20} color={theme.colors.background} />
      </View>
      <Text style={{ fontSize: theme.fontSizes.bodyMedium, fontWeight: '600' }}>Add items</Text>
    </TouchableOpacity>
  </BottomSheet>
)
