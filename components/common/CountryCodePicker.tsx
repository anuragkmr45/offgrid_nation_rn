// components/common/CountryCodePicker.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'

export interface CountryCodePickerProps {
  /** ISO country code (e.g. 'US', 'IN') */
  countryCode: CountryCode
  /** Callback when a country is selected */
  onSelect: (country: Country) => void
  /** Optional style override for the button container */
  containerButtonStyle?: StyleProp<ViewStyle>
}

/**
 * A reusable country-code picker button with flag + dial code.
 */
const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  countryCode,
  onSelect,
  containerButtonStyle,
}) => (
  <CountryPicker
    countryCode={countryCode}
    withCallingCode={true}
    withFilter={true}
    withFlag={true}
    withEmoji={true}
    withCountryNameButton={false}
    onSelect={onSelect}
    containerButtonStyle={[styles.button, containerButtonStyle]}
  />
)

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    height: 50,
  },
})

export default CountryCodePicker
