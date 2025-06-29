// src/screens/SendOtp.tsx

import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { Button, InputField } from '@/components/common'
import Header from '@/components/common/Header'
import PhoneInput from '@/components/common/PhoneInput'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { validatePhone, validateUsername } from '@/utils/validation/signupValidation'
import { Country } from 'react-native-country-picker-modal'

const SendOtp: React.FC = () => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState<Country['cca2']>('US')
  const [callingCode, setCallingCode] = useState<string[]>(['1'])
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { checkUsername, register } = useAuth()

  const isValid =
    validateUsername(username) === null &&
    validatePhone(phone) === null

  const handleNext = async () => {
    setIsLoading(true)
    try {
      const trimmedUsername = username.trim().toLowerCase()
      const data = await checkUsername(trimmedUsername).unwrap()
      const { exists = false } = data || {};

      if (exists) {
        const phoneWithCountryCode = `+${callingCode[0]} ${phone}`
        const reg = await register({ username: trimmedUsername, mobile: phoneWithCountryCode })

        Toast.show({
          type: 'success',
          text1: reg.message || `OTP sent to ${phoneWithCountryCode}`,
        })

        setTimeout(() => {
          router.push({
            pathname: '/auth/register/VerifyOtp',
            params: { username: trimmedUsername, mobile: phoneWithCountryCode },
          })
        }, 1800)
      } else {
        Toast.show({ type: 'error', text1: 'Username not available' })
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Fail to send OTP.'
      Toast.show({ type: 'error', text1: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} animated />

      {/* Top Section */}
      <Header
        title="Registeration"
        onBack={() => router.back()}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.background}
        iconColor={theme.colors.background}
        showShadow
      />
      <View style={styles.topContainer}>
        <InputField value={username.trim().toLowerCase()} keyboardType={'default'} onChangeText={setUsername} placeholder="Username..." />

        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          countryCode={countryCode}
          callingCode={callingCode}
          onSelectCountry={(c: Country) => {
            setCountryCode(c.cca2)
            setCallingCode(c.callingCode)
          }}
          pickerStyle={styles.countryPicker}
          inputProps={{ placeholder: 'Phone number', keyboardType: 'phone-pad' }}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Button
          onPress={handleNext}
          text="Next"
          disabled={!isValid}
          loading={isLoading}
          style={[styles.button, !isValid && styles.buttonDisabled]}
          textColor={theme.colors.primary}
          debounce
          debounceDelay={500}
          loaderStyle={theme.colors.textPrimary}
        />

        <View style={styles.signInFooter}>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInLink} onPress={() => router.back()}>
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'space-between',
  },
  topContainer: {
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSizes.headlineSmall,
    fontWeight: '600',
    color: theme.colors.background,
    marginBottom: 32,
  },
  countryPicker: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    height: 50,
  },
  bottomContainer: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signInFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  signInText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  signInLink: {
    fontWeight: '600',
    color: theme.colors.background,
  },
})

export default SendOtp
