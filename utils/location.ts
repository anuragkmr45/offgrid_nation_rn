// utils/location.ts

import * as Location from 'expo-location'
import { Alert, Linking, Platform } from 'react-native'

/**
 * Request “foreground” location permission.
 */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  return status === Location.PermissionStatus.GRANTED
}

/**
 * Show “go to settings” alert if permission was denied.
 */
export function showLocationDeniedDialog() {
  Alert.alert(
    'Location Permission Required',
    'Please enable location access in Settings to use this feature.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Settings', onPress: () => Linking.openSettings() },
    ]
  )
}

/**
 * Internally used: if GPS/services are off, prompt user to turn them on.
 */
async function promptToEnableGPS(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      // this shows the native “Turn on location” dialog on Android
      await Location.enableNetworkProviderAsync()
    } catch {
      // fallback if the above API is unavailable or fails
      Alert.alert(
        'Enable Location Services',
        'Please enable location services to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
      )
    }
  } else {
    // iOS cannot programmatically open the system GPS prompt
    Alert.alert(
      'Enable Location Services',
      'Please enable Location Services from Settings > Privacy > Location Services.',
      [{ text: 'OK' }]
    )
  }
}

/**
 * Check that location services are on *and* permission is granted,
 * then return a LocationObject or null.
 */
export async function getCurrentPosition(): Promise<Location.LocationObject | null> {
  // 1) Are services enabled?
  const servicesEnabled = await Location.hasServicesEnabledAsync()
  if (!servicesEnabled) {
    // fire native GPS dialog…
    await promptToEnableGPS()
    return null
  }

  // 2) Permissions
  let { status } = await Location.getForegroundPermissionsAsync()
  if (status === Location.PermissionStatus.DENIED) {
    status = (await Location.requestForegroundPermissionsAsync()).status
  }
  if (status !== Location.PermissionStatus.GRANTED) {
    return null
  }

  // 3) Finally try to fetch
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
  } catch {
    return null
  }
}

/**
 * Returns “lat,lng” (to 6 decimal places) or null.
 */
export async function getFormattedLocation(): Promise<string | null> {
  const pos = await getCurrentPosition()
  if (!pos) return null
  const { latitude, longitude } = pos.coords
  return `${latitude.toFixed(6)},${longitude.toFixed(6)}`
}

/**
 * Reverse‐geocode to “City, Country”.
 */
export async function getReadableLocation(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude })
    const city    = place.city ?? place.subregion ?? ''
    const country = place.country ?? ''
    const parts   = [city, country].filter(Boolean)
    return parts.length ? parts.join(', ') : null
  } catch {
    return null
  }
}
