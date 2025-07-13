// src/app/auth/forgot-password/SendOtp.tsx
import { Button } from '@/components/common'
import Header from '@/components/common/Header'
import PhoneInput from '@/components/common/PhoneInput'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { validatePhone } from '@/utils/validation/signupValidation'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import type { Country, CountryCode } from 'react-native-country-picker-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const SendOtp: React.FC = () => {
  const router = useRouter()
  const { triggerForgotPassword } = useAuth()

  // phone number (was `email`)
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState<CountryCode>('US')
  const [callingCode, setCallingCode] = useState<string[]>(['1'])
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const phoneError = validatePhone(phone)
  const isValid = phoneError === null

  const handleNext = async () => {
    setIsLoading(true)
    try {
      const phoneWithCountryCode = `+${callingCode[0]} ${phone}`
      console.log({ phoneWithCountryCode });
      await triggerForgotPassword({ mobile: phoneWithCountryCode })
      Toast.show({ type: 'success', text1: 'OTP sent' })
      setTimeout(() => {
        router.push({
          pathname: '/auth/forgot-password/VerifyOtp',
          params: { mobile: phoneWithCountryCode },
        })
      }, 1500)
    } catch (error: any) {
      const msg = error?.data?.message || 'Failed to send OTP.'
      Toast.show({ type: 'error', text1: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0}
    >
      <StatusBar animated backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <SafeAreaView style={styles.safeArea}>
        <Header
          // title="Registeration"
          onBack={() => router.back()}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.background}
          iconColor={theme.colors.background}
        // showShadow
        />

        {/* Body */}
        <View style={styles.topContainer}>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.subtitle}>
            Please enter your phone number and we will send an OTP code in the next step
          </Text>

          {/* <-- Replaced InputField with PhoneInput --> */}
          <PhoneInput
            value={phone.trim()}
            onChangeText={setPhone}
            countryCode={countryCode}
            callingCode={callingCode}
            onSelectCountry={(c: Country) => {
              setCountryCode(c.cca2)
              setCallingCode(c.callingCode)
            }}
          />
          {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
        </View>

        {/* Footer */}
        <View style={styles.bottomContainer}>
          <Button
            text="Continue"
            onPress={handleNext}
            disabled={!isValid || isLoading}
            style={[styles.button, !isValid && styles.buttonDisabled]}
            textColor={theme.colors.primary}
            debounce
            debounceDelay={500}
            loaderStyle={theme.colors.textPrimary}
            loading={isLoading}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'flex-start',
  },
  safeArea: { flex: 1 },
  topContainer: {
    paddingHorizontal: 22,
    flex: 1,
  },
  title: {
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: '800',
    color: theme.colors.background,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.background,
    marginBottom: 24,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 12,
    marginTop: 4,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 22,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})

export default SendOtp
