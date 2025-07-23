// src/app/auth/forgot-password/ResetNewPassword.tsx
import { Button, CustomModal } from '@/components/common'
import Header from '@/components/common/Header'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  validateConfirmPassword,
  validatePassword,
} from '@/utils/validation/signupValidation'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const ResetNewPassword: React.FC = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { triggerResetPassword } = useAuth()
  const { mobile } = useLocalSearchParams<{ mobile: string }>()

  // validation
  const passwordError = validatePassword(password)
  const confirmError = validateConfirmPassword(confirm, password)
  const isValid = passwordError === null && confirmError === null;

  const handleSubmit = async () => {
    const trimedPassword = password.trim();

    try {
      await triggerResetPassword({ mobile: mobile, newPassword: trimedPassword });
      // Toast.show({
      //   type: "success",
      //   text1: "OTP verified"
      // })
      setShowModal(true)
      // After showing modal, auto-navigate
      setTimeout(() => router.replace('/auth/login/Login'), 1500)
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Reset password fails.';
      Toast.show({
        type: "error",
        text1: errorMessage
      })
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
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

          {/* Main content */}
          <View style={styles.topContainer}>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>
              Create your new password. If you forget it, you have to do forgot password again.
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="New Password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showPass}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPass(v => !v)}
              >
                <Ionicons
                  name={showPass ? 'eye' : 'eye-off'}
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <View style={styles.inputWrapper}>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Confirm New Password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showConfirm}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirm(v => !v)}
              >
                <Ionicons
                  name={showConfirm ? 'eye' : 'eye-off'}
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {confirmError && (
              <Text style={styles.errorText}>{confirmError}</Text>
            )}
          </View>

          {/* Footer button */}
          <View style={styles.bottomContainer}>
            <Button
              text="Continue"
              onPress={handleSubmit}
              disabled={!isValid}
              style={[styles.button, !isValid && styles.buttonDisabled]}
              textColor={theme.colors.primary}
              debounce
              loaderStyle={theme.colors.textPrimary}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title=""
      >
        <View style={styles.modalInner}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="lock-closed"
              size={48}
              color={theme.colors.background}
            />
          </View>
          <Text style={styles.modalTitle}>Reset Password Successful!</Text>
          <Text style={styles.modalText}>Please wait...</Text>
          <Text style={styles.modalText}>You will be directed to login screen</Text>
        </View>
      </CustomModal>
    </>
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
  topContainer: { flex: 1 },
  title: {
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: "700",
    color: theme.colors.background,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.background,
    marginBottom: 24,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 15,
    height: 50,
    paddingHorizontal: 16,
    paddingRight: 48,
    color: theme.colors.textPrimary,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 12,
    marginBottom: 8,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
  },
  buttonDisabled: { opacity: 0.6 },
  modalInner: { alignItems: 'center', marginVertical: 40 },
  iconCircle: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: theme.fontSizes.titleLarge,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.bodyMedium,
    textAlign: 'center',
  },
})

export default ResetNewPassword
