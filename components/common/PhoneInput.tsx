// components/common/PhoneInput.tsx

import React from 'react'
import { StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native'
import { Country, CountryCode } from 'react-native-country-picker-modal'
import CountryCodePicker from './CountryCodePicker'
import { InputField } from './index'

export interface PhoneInputProps {
  /** Current phone number value */
  value: string
  /** Callback when phone number changes */
  onChangeText: (text: string) => void
  /** ISO country code, e.g. 'US' or 'IN' */
  countryCode: CountryCode
  /** Calling code array, e.g. ['1'] or ['91'] */
  callingCode: string[]
  /** Handler when user selects a new country */
  onSelectCountry: (country: Country) => void
  /** Style overrides for container */
  style?: StyleProp<ViewStyle>
  /** Additional props passed to the internal TextInput */
  inputProps?: TextInputProps
  /** Style override for the country picker button */
  pickerStyle?: StyleProp<ViewStyle>
}

/**
 * A combined phone input component that includes a country-code picker
 * and a phone number text field side by side.
 */
const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  countryCode,
  callingCode,
  onSelectCountry,
  style,
  inputProps,
  pickerStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <CountryCodePicker
        countryCode={countryCode}
        onSelect={onSelectCountry}
        containerButtonStyle={pickerStyle || styles.picker}
      />
      <InputField
        value={value}
        onChangeText={onChangeText}
        placeholder="Phone number"
        keyboardType="phone-pad"
        style={[styles.input, inputProps?.style]}
        {...inputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  picker: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    height: 50,
    marginLeft: 8,
    paddingHorizontal: 16,
    borderWidth: 0,
  },
})

export default PhoneInput
