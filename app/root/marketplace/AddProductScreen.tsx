// app/marketplace/AddProductScreen.tsx

import { Button, InputField } from '@/components/common'
import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const CONDITION_OPTIONS = [
  { label: 'New',           value: 'new' },
  { label: 'Used-Like New', value: 'like_new' },
  { label: 'Used-Good',     value: 'good' },
  { label: 'Others',        value: 'others' },
]

export default function AddProductScreen() {
  const router = useRouter()

  // form state
  const [photos, setPhotos]       = useState<string[]>([])
  const [title, setTitle]         = useState('')
  const [price, setPrice]         = useState('')
  const [condition, setCondition] = useState<string|undefined>()
  const [description, setDescription] = useState('')
  const [location, setLocation]   = useState('')

  const handleAddPhoto = () => {
    // TODO: image picker
  }
  const handlePublish = () => {
    // TODO: submit form
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing details</Text>
        <TouchableOpacity onPress={handlePublish} style={styles.iconButton}>
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </View>

      {/* BODY + STICKY FOOTER */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 80 })}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Add Photos */}
          <TouchableOpacity onPress={handleAddPhoto} style={styles.photoPicker}>
            <Ionicons name="camera-outline" size={32} color={theme.colors.textSecondary} />
            <Text style={styles.photoPickerText}>Add photos</Text>
          </TouchableOpacity>
          <Text style={styles.photoCount}>Photos: {photos.length}/10</Text>

          {/* Title & Price */}
          <InputField
            placeholder="Enter Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <InputField
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Condition */}
          <Text style={styles.sectionLabel}>Condition</Text>
          <View style={styles.conditionRow}>
            {CONDITION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setCondition(opt.value)}
                style={[
                  styles.conditionButton,
                  condition === opt.value && styles.conditionButtonSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.conditionText,
                    condition === opt.value && styles.conditionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Description....."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
          />

          {/* Location */}
          <InputField
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          {/* Padding bottom so last field isn't hidden */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* STICKY PUBLISH BUTTON */}
        <View style={styles.stickyFooter}>
          <Button
            text="Publish"
            onPress={handlePublish}
            disabled={!title || !price}
            textColor={theme.colors.background}
            style={styles.publishButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex:            1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height:            56,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textSecondary,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize:   theme.fontSizes.titleLarge,
    fontWeight: '700',
    color:      theme.colors.textPrimary,
  },
  publishText: {
    fontSize:   theme.fontSizes.titleMedium,
    fontWeight: '600',
    color:      theme.colors.primary,
  },
  content: {
    padding: 16,
  },

  photoPicker: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  4,
  },
  photoPickerText: {
    marginLeft: 8,
    fontSize:   theme.fontSizes.bodyMedium,
    color:      theme.colors.textPrimary,
  },
  photoCount: {
    marginBottom: 16,
    fontSize:     theme.fontSizes.bodyMedium,
    color:        theme.colors.textSecondary,
  },

  input: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize:      theme.fontSizes.titleSmall,
    fontWeight:    '500',
    color:         theme.colors.textPrimary,
    marginBottom:  8,
  },
  conditionRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    marginBottom:  16,
  },
  conditionButton: {
    borderWidth:       1,
    borderColor:       theme.colors.textSecondary,
    borderRadius:      16,
    paddingHorizontal: 12,
    paddingVertical:   6,
    marginRight:       8,
    marginBottom:      8,
  },
  conditionButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor:     theme.colors.primary,
  },
  conditionText: {
    fontSize: theme.fontSizes.bodyMedium,
    color:    theme.colors.textPrimary,
  },
  conditionTextSelected: {
    color:      theme.colors.background,
    fontWeight: '600',
  },
  textArea: {
    borderWidth:       1,
    borderColor:       theme.colors.textSecondary,
    borderRadius:      8,
    padding:           12,
    marginBottom:      16,
    textAlignVertical: 'top',
  },

  stickyFooter: {
    position:         'absolute',
    bottom:           0,
    left:             0,
    right:            0,
    backgroundColor:  theme.colors.background,
    padding:          16,
    borderTopWidth:   StyleSheet.hairlineWidth,
    borderTopColor:   theme.colors.textSecondary,
  },
  publishButton: {
    borderRadius: theme.borderRadius,
  },
})
