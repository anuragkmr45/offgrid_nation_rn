// src/app/auth/forgot-password/SendOtp.tsx
import { Button, InputField } from '@/components/common'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { validatePhone } from '@/utils/validation/signupValidation'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const SendOtp: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const { triggerForgotPassword } = useAuth();

  const emailError = validatePhone(email)
  const isValid = emailError === null;

  const handleNext = async () => {
    const trimedMobile = email.trim().toLowerCase();

    try {
      await triggerForgotPassword({ mobile: trimedMobile });
      Toast.show({
        type: "success",
        text1: "OTP send"
      })
      setTimeout(() => {
        router.push({ pathname: '/auth/forgot-password/VerifyOtp', params: { mobile: trimedMobile } });
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Registration fails.';
      Toast.show({
        type: "error",
        text1: errorMessage
      })
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.background} />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.topContainer}>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.subtitle}>
            Please enter your phone nunber and we will send an OTP code in the next step
          </Text>

          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your Phone number."
            keyboardType="phone"
            style={styles.input}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        {/* Footer button */}
        <View style={styles.bottomContainer}>
          <Button
            text="Continue"
            onPress={handleNext}
            // disabled={!isValid}
            style={[styles.button, !isValid && styles.buttonDisabled]}
            textColor={theme.colors.primary}
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
    paddingHorizontal: 22,
    justifyContent: 'flex-start',
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.background,
    marginBottom: 24,
  },
  input: {
    borderRadius: 15,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 4,
    color: theme.colors.textPrimary,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 12,
    marginBottom: 4,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.textPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})

export default SendOtp
