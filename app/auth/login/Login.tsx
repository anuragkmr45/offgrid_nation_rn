import { Button, InputField } from '@/components/common'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { validateLoginPassword, validateLoginUsername } from '@/utils/validation/loginValidation'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

export default function LoginScreen() {
  const router = useRouter()
  const { login, isLoginLoading } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const identifierError = validateLoginUsername(identifier)
  const passwordError = validateLoginPassword(password)
  const isValid = !identifierError && !passwordError

  const handleLogin = async () => {
    try {
      await login({ loginId: identifier.trim().toLowerCase(), password: password.trim() });
      Toast.show({
        type: 'success',
        text1: 'Login Successful 🎉',
      });
      router.replace('/');
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Login failed, please try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
      });
      // console.error('Login failed', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={{ width: '100%', flex: 1 }}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901306/fr-bg-white_hea7pb.png' }}
            style={styles.logo}
          />
        </View>
        <View style={styles.formContainer}>
          <InputField
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Username, Phone number or email"
            keyboardType="default"
          />
          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password/SendOtp')}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            text="Log In"
            onPress={handleLogin}
            loading={isLoginLoading}
            disabled={!isValid}
            style={styles.loginButton}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          {/* Social login buttons */}
          <Button
            text="Continue with Google"
            onPress={() => {/* TODO: Google login */ }}
            style={[styles.socialButton, { backgroundColor: theme.colors.textPrimary }]}
          // override text color
          />
          <Button
            text="Continue with Apple"
            onPress={() => {/* TODO: Apple login */ }}
            style={[styles.socialButton, { backgroundColor: theme.colors.background }]}
            textColor={theme.colors.textPrimary}
          />
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register/SendOtp')}>
              <Text style={styles.signUpLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 70,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  formContainer: {
    flex: 3,
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  forgotText: {
    color: theme.colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 12,
    backgroundColor: theme.colors.textPrimary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.textPrimary,
  },
  dividerText: {
    marginHorizontal: 8,
    color: theme.colors.textPrimary,
  },
  socialButton: {
    marginBottom: 12,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signUpText: {
    color: theme.colors.background,
  },
  signUpLink: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
})
