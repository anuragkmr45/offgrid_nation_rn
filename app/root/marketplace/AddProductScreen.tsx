// app/marketplace/AddProductScreen.tsx

import { Button, InputField, SearchBar } from '@/components/common'
import { BottomSheet } from '@/components/common/BottomSheet'
import { theme } from '@/constants/theme'
import { useCreateProduct, useListCategories } from '@/features/products/hooks/useProducts'
import { pickMultipleFromGallery } from '@/utils/imagePicker'
import { getCurrentPosition } from '@/utils/location'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
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
import Toast from 'react-native-toast-message'

const CONDITION_OPTIONS = [
  { label: 'New', value: 'New' },
  { label: 'Used-Like New', value: 'Used - Like New' },
  { label: 'Used-Good', value: 'Used - Good' },
  { label: 'Others', value: 'Other' },
]

const getMimeType = (uri: string) => {
  if (uri.endsWith('.png')) return 'image/png'
  if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg'
  if (uri.endsWith('.heic')) return 'image/heic'
  return 'image/jpeg'
}

export default function AddProductScreen() {
  const router = useRouter()

  const [photos, setPhotos] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState<string>()
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  const [isCatSheetVisible, setCatSheetVisible] = useState(false)
  const [catQuery, setCatQuery] = useState('')

  const [createProduct, { isLoading: submitting }] = useCreateProduct()
  const {
    categories = [],
    isLoading: isCatsLoading,
    error: catsError,
  } = useListCategories()

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(catQuery.toLowerCase())
  )

  const handleAddPhoto = async () => {
    const uris = await pickMultipleFromGallery()
    if (uris.length) {
      setPhotos(prev => {
        const combined = [...prev, ...uris]
        return combined.slice(0, 10)
      })
    }
  }

  const handlePublish = async () => {
    if (!title || !price || !condition || !category) {
      Alert.alert('Missing fields', 'Please fill all required fields.')
      return
    }

    const loc = await getCurrentPosition()
    if (!loc) {
      Alert.alert('Location Error', 'Unable to fetch location.')
      return
    }

    const formData = new FormData()
    photos.forEach((uri, idx) => {
      formData.append('pictures', {
        uri,
        name: `photo_${idx}.jpg`,
        type: getMimeType(uri),
      } as unknown as Blob)
    })
    formData.append('title', title)
    formData.append('price', price.replace(/[^0-9.]/g, '')) // strip $₹ etc
    formData.append('condition', condition)
    formData.append('description', description)
    formData.append('category', category) // send _id if required
    formData.append('lng', loc.coords.longitude.toString())
    formData.append('lat', loc.coords.latitude.toString())

    try {
      // await createProduct(formData).unwrap()
      console.log(formData);
      
      Toast.show({ type: 'success', text1: 'Product added successfully' })
      // router.back()
    } catch (err: any) {
      const error = err?.data?.error || 'Error while publishing product'
      console.log({ error })
      Toast.show({ type: 'error', text1: error })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Listing</Text>
        <TouchableOpacity onPress={handlePublish} style={styles.iconButton} disabled={submitting}>
          <Text style={styles.publishText}>{submitting ? 'Publishing...' : 'Publish'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 80 })}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {photos.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
              {photos.map((uri, idx) => (
                <Image key={uri + idx} source={{ uri }} style={styles.photo} />
              ))}
              {photos.length < 10 && (
                <TouchableOpacity onPress={handleAddPhoto} style={styles.addMore}>
                  <Ionicons name="camera-outline" size={32} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </ScrollView>
          ) : (
            <TouchableOpacity onPress={handleAddPhoto} style={styles.photoPicker} activeOpacity={0.7}>
              <Ionicons name="camera-outline" size={32} color={theme.colors.textSecondary} />
              <Text style={styles.photoPickerText}>Add Photos</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.photoCount}>Photos: {photos.length}/10</Text>

          <InputField placeholder="Title" value={title} onChangeText={setTitle} />
          <InputField placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />

          <TouchableOpacity
            onPress={() => setCatSheetVisible(true)}
            style={[styles.input, { justifyContent: 'center' }]}
          >
            <Text
              style={{
                color: category ? theme.colors.textPrimary : theme.colors.textSecondary,
              }}
            >
              {category || 'Category'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Condition</Text>
          <View style={styles.conditionRow}>
            {CONDITION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setCondition(opt.value)}
                style={[
                  styles.conditionButton,
                  condition === opt.value && styles.conditionSelected,
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

          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your product"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Button text={submitting ? 'Publishing...' : 'Publish'} onPress={handlePublish} disabled={submitting} />
        </View>
      </KeyboardAvoidingView>

      <BottomSheet
        visible={isCatSheetVisible}
        onClose={() => {
          setCatSheetVisible(false)
          setCatQuery('')
        }}
        height="60%"
      >
        <SearchBar value={catQuery} onChangeText={setCatQuery} placeholder="Search categories" />
        {isCatsLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : catsError ? (
          <Text style={{ marginTop: 20, textAlign: 'center' }}>Failed to load categories.</Text>
        ) : (
          <ScrollView style={{ marginTop: 8 }}>
            {filteredCategories.map(cat => (
              <TouchableOpacity
                key={cat._id}
                style={sheetStyles.catRow}
                activeOpacity={0.7}
                onPress={() => {
                  setCategory(cat.title) // send _id for backend
                  setCatSheetVisible(false)
                  setCatQuery('')
                }}
              >
                <Image source={{ uri: cat.imageUrl }} style={sheetStyles.catImage} resizeMode="cover" />
                <Text style={sheetStyles.catText}>{cat.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </BottomSheet>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textSecondary,
  },
  iconButton: { padding: 8 },
  headerTitle: {
    fontSize: theme.fontSizes.titleLarge,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  publishText: {
    fontSize: theme.fontSizes.titleMedium,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  content: { padding: 16 },
  photoPicker: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  photoPickerText: {
    marginLeft: 8,
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textPrimary,
  },
  photoCount: {
    marginVertical: 8,
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textSecondary,
  },
  photoScroll: { marginBottom: 16 },
  photo: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  addMore: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: theme.fontSizes.titleSmall,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  conditionRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  conditionButton: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  conditionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  conditionText: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textPrimary,
  },
  conditionTextSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
    height: 100,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
  },
})

const sheetStyles = StyleSheet.create({
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textSecondary,
  },
  catImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  catText: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textPrimary,
  },
})
