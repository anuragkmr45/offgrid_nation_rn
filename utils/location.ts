// utils/location.ts
import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

/** Ask for foreground permission and return true/false */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (e) {
    // If we ever land here on iOS, it's almost always missing NSLocationWhenInUseUsageDescription
    return false;
  }
}

/** Generic “open settings” alert */
export function showLocationDeniedDialog() {
  Alert.alert(
    'Location Permission Required',
    'Please enable location access in Settings to use this feature.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Settings', onPress: () => Linking.openSettings() },
    ],
  );
}

/** Platform-specific helper to get the user to switch GPS on */
async function promptToEnableGPS(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      // Native “Turn on location” dialog (high-accuracy mode) – Android only
      await Location.enableNetworkProviderAsync();
    } catch {
      // Fallback: open Settings
      Alert.alert(
        'Enable Location Services',
        'Please enable GPS/location in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  } else {
    // iOS offers no programmatic GPS prompt; we can only explain & open Settings
    Alert.alert(
      'Enable Location Services',
      'Please enable Location Services from Settings ▸ Privacy ▸ Location Services.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ],
    );
  }
}

/**
 * Ensure (1) Location Services are ON and (2) permission is GRANTED,
 * then return the current position or null.
 */
export async function getCurrentPosition(): Promise<Location.LocationObject | null> {
  /* 1️⃣  Services enabled? */
  const servicesOn = await Location.hasServicesEnabledAsync();
  if (!servicesOn) {
    await promptToEnableGPS();        // user sees native or custom dialog
    return null;                      // call again later if needed
  }

  /* 2️⃣  Permission flow */
  let { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    if (canAskAgain) {
      const res = await Location.requestForegroundPermissionsAsync();
      status = res.status;
    } else {
      showLocationDeniedDialog();     // permanently denied → Settings
      return null;
    }
  }
  if (status !== Location.PermissionStatus.GRANTED) return null;

  const last = await Location.getLastKnownPositionAsync({
    maxAge: 5 * 60_000,       // <= 5min old
    requiredAccuracy: 100,    // meters
  });
  if (last) return last;

  /* 3️⃣  Fetch location */
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Platform.OS === 'ios' ? Location.Accuracy.Highest : Location.Accuracy.High,
      mayShowUserSettingsDialog: true,
    });
  } catch {
    return null; // network off, indoor, etc.
  }
}

/** Convenience: returns “lat,lng” to 6 dp or null */
export async function getFormattedLocation(): Promise<string | null> {
  const pos = await getCurrentPosition();
  if (!pos) return null;
  const { latitude, longitude } = pos.coords;
  return `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
}

/** Reverse-geocode to “City, Country” or null */
export async function getReadableLocation(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const perm = await Location.getForegroundPermissionsAsync();
    if (perm.status !== Location.PermissionStatus.GRANTED) {
      const res = await Location.requestForegroundPermissionsAsync();
      if (res.status !== Location.PermissionStatus.GRANTED) return null;
    }
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    const city = place.city ?? place.subregion ?? '';
    const country = place.country ?? '';
    const parts = [city, country].filter(Boolean);
    return parts.length ? parts.join(', ') : null;
  } catch {
    return null;
  }
}
