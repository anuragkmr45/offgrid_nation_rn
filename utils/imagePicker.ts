// utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

type MediaTypeOption =
  | ImagePicker.MediaTypeOptions.Images
  | ImagePicker.MediaTypeOptions.Videos
  | ImagePicker.MediaTypeOptions.All;

function settingsAlert(title: string, msg: string) {
  Alert.alert(title, msg, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Open Settings', onPress: () => Linking.openSettings() },
  ]);
}

async function ensureCameraPermission(): Promise<boolean> {
  let { status, canAskAgain } = await ImagePicker.getCameraPermissionsAsync();

  if (status !== ImagePicker.PermissionStatus.GRANTED) {
    if (canAskAgain) {
      const res = await ImagePicker.requestCameraPermissionsAsync();
      status = res.status;
      canAskAgain = res.canAskAgain ?? false;
    } else {
      settingsAlert(
        'Camera Permission',
        'Please enable camera access in Settings to capture media.'
      );
      return false;
    }
  }
  return status === ImagePicker.PermissionStatus.GRANTED;
}

function handleLimitedAccess(accessPrivileges?: 'all' | 'limited' | 'none') {
  if (Platform.OS === 'ios' && accessPrivileges === 'limited') {
    // Optional: nudge user to expand selection in Settings
    Alert.alert(
      'Limited Photo Access',
      'You’ve given access to selected photos. If you can’t see some images, manage access in Settings.',
      [{ text: 'OK' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
    );
  }
}

async function ensureLibraryPermission(): Promise<boolean> {
  let { status, canAskAgain, accessPrivileges } = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (status !== ImagePicker.PermissionStatus.GRANTED) {
    if (canAskAgain) {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      status = res.status;
      canAskAgain = res.canAskAgain ?? false;
      accessPrivileges = (res as any).accessPrivileges;
    } else {
      settingsAlert(
        'Photos Permission',
        'Please enable Photos access in Settings to pick images or videos.'
      );
      return false;
    }
  }
  handleLimitedAccess(accessPrivileges as any);
  return status === ImagePicker.PermissionStatus.GRANTED || accessPrivileges === 'limited';
}

/** Launch camera for one item (photo or video) */
export async function pickFromCamera(
  mediaTypes: MediaTypeOption = ImagePicker.MediaTypeOptions.Images
): Promise<string | null> {
  const ok = await ensureCameraPermission();
  if (!ok) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes,
    quality: 0.8,
    videoQuality: Platform.OS === 'ios'
      ? ImagePicker.UIImagePickerControllerQualityType.Medium
      : undefined,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

/** Pick exactly one item from library */
export async function pickFromGallery(
  mediaTypes: MediaTypeOption = ImagePicker.MediaTypeOptions.Images
): Promise<string | null> {
  const ok = await ensureLibraryPermission();
  if (!ok) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes,
    allowsMultipleSelection: false,
    quality: 0.8,
    selectionLimit: 1,
    defaultTab: Platform.OS === 'android' ? 'albums' : undefined,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

/** Pick multiple items from library (images/videos) */
export async function pickMultipleFromGallery(
  mediaTypes: MediaTypeOption = ImagePicker.MediaTypeOptions.All, selectionLimit = 10
): Promise<string[]> {
  const ok = await ensureLibraryPermission();
  if (!ok) return [];

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes,
    allowsMultipleSelection: true,          // ✅ official multi-select
    selectionLimit,                     // adjust to your cap
    quality: 0.8,
  });

  if (result.canceled) return [];
  return result.assets.map(a => a.uri);
}
