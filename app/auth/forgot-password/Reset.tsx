// src/app/auth/forgot-password/ResetNewPassword.tsx
import { Button, Modal } from '@/components/common'
import { theme } from '@/constants/theme'
import {
    validateConfirmPassword,
    validatePassword,
} from '@/utils/validation/signupValidation'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ResetNewPassword: React.FC = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // validation
  const passwordError = validatePassword(password)
  const confirmError = validateConfirmPassword(confirm, password)
  const isValid = passwordError === null && confirmError === null

  const handleSubmit = () => {
    // TODO: call reset password API
    setShowModal(true)
    // After showing modal, auto-navigate
    setTimeout(() => router.replace('/auth/login/Login'), 2500)
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <SafeAreaView style={styles.safeArea}>

          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.background}
              />
            </TouchableOpacity>
          </View>

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
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
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
      </Modal>
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
    fontWeight: "600",
    color: theme.colors.textPrimary,
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
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 15,
    height: 50,
    paddingHorizontal: 16,
    paddingRight: 48,
    color: theme.colors.background,
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
    backgroundColor: theme.colors.textPrimary,
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
