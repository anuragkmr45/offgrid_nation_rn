import { Video } from 'expo-av'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal as RNModal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { theme } from '../../constants/theme'
// 1. Button
export interface ButtonProps {
  onPress: () => void
  text: string
  loading?: boolean
  disabled?: boolean
  style?: object
  textColor?: string
  icon?: string
  iconPosition?: 'left' | 'right'
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  text,
  loading,
  disabled,
  style,
  textColor,
  icon,
  iconPosition = 'left',
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    style={[styles.button, { backgroundColor: theme.colors.primary }, style]}
  >
    {loading ? (
      <ActivityIndicator color={theme.colors.background} />
    ) : (
      <View
        style={[
          styles.content,
          {
            flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
            alignItems: 'center',
          },
        ]}
      >
        {/* {icon && <View style={styles.iconWrapper}>{icon}</View>} */}
        {icon && <View style={styles.iconWrapper}><Image source={{uri: icon}} style={{width: 20, height: 20}} /></View>}
        <Text style={[styles.buttonText, { color: textColor }]}>
          {text}
        </Text>
      </View>
    )}
  </TouchableOpacity>
)

// 2. Modal
export interface ModalProps {
  visible: boolean
  title?: string
  children: React.ReactNode
  onClose: () => void
  style: any
}
export const CustomModal: React.FC<ModalProps> = ({ visible, title, children, onClose, style }) => (
  <RNModal transparent visible={visible} animationType="fade">
    <BlurView intensity={50} style={styles.modalOverlay}>
      <View style={[styles.modalContent,style, { backgroundColor: theme.colors.background }]}>
        {title && <Text style={styles.modalTitle}>{title}</Text>}
        <View>{children}</View>
        <TouchableOpacity onPress={onClose} style={styles.modalClose}>
          <Text style={{ color: theme.colors.accent }}>Close</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  </RNModal>
)

// 3. SearchBar
export interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
  onFocus?: () => void;
  placeholder?: string
  style?: any
  editable?: boolean
}
export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSubmitEditing,onFocus, placeholder, style, editable = true }) => (
  <BlurView intensity={20} style={styles.searchContainer}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onFocus={onFocus} 
      placeholder={placeholder || 'Search...'}
      placeholderTextColor={theme.colors.textSecondary}
      style={[styles.searchInput,style, { color: theme.colors.textPrimary }]}
      returnKeyType="default"
      editable={editable}
    />
  </BlurView>
)

// 4. Loader
export const Loader: React.FC = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
)

// 5. InputField
export interface InputFieldProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: any
  style?: any
}
export const InputField: React.FC<InputFieldProps> = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    style={[styles.input, { borderColor: theme.colors.background, backgroundColor: theme.colors.background }, style]}
    placeholderTextColor={theme.colors.textSecondary}
    aria-disabled
  />
)

// 6. MediaCarousel
const { width } = Dimensions.get('window')
export interface MediaCarouselProps {
  mediaUrls: string[]
}
export const MediaCarousel: React.FC<MediaCarouselProps> = ({ mediaUrls }) => {
  const renderItem = ({ item }: { item: string }) => {
    const isVideo = item.match(/\.(mp4|mov|webm)$/i)
    return (
      <View style={styles.carouselItem}>
        {isVideo ? (
          <Video
            source={{ uri: item }}
            style={styles.video}
            useNativeControls
          />
        ) : (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      </View>
    )
  }

  return (
    <FlatList
      data={mediaUrls}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      style={styles.carousel}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginHorizontal: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
  width: '94%', // ⬅️ Make it almost full width
  maxHeight: '80%', // ⬅️ Allow more vertical height
  borderRadius: 16,
  padding: 16,
  backgroundColor: theme.colors.background,
},

  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: theme.colors.textPrimary },
  modalClose: { marginTop: 16, alignSelf: 'flex-end' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 18,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
  },
  searchInput: { flex: 1, fontSize: 16, padding: 18},
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background + '88',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  carousel: { height: 300 },
  carouselItem: { width, justifyContent: 'center', alignItems: 'center' },
  image: { width: width - 32, height: 280, borderRadius: 8 },
  video: { width: width - 32, height: 280, borderRadius: 8 },
  
})
