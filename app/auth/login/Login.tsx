import { Button, InputField } from '@/components/common'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
// import { signInWithGoogleAsync } from '@/utils/googleLogin'
// import { JwtUtil } from '@/utils/jwtUtil'
import { validateLoginPassword, validateLoginUsername } from '@/utils/validation/loginValidation'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
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
      router.replace('/root/feed');
    } catch (err: any) {
      const errorMessage = err?.data?.error || 'Login failed, please try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
      });
      console.error('Login failed', err);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const googleData = await signInWithGoogleAsync();
  //     if (!googleData) {
  //       Toast.show({ type: 'error', text1: 'Google login cancelled' });
  //       return;
  //     }

  //     const { idToken, email, name } = googleData;

  //     // Generate JWT locally (⚠️ if needed, but ideally do this on backend)
  //     const jwt = JwtUtil.generateUserJwt({
  //       uid: email,  // if no UID, use email as fallback
  //       email,
  //       displayName: name,
  //     });

  //     // Send to backend to get auth key (simulate your Flutter `repository.googleLogin`)
  //     const authKey = await loginWithGoogle(jwt); // Implement this in your `useAuth()` or service

  //     await saveSession(authKey); // Save session locally

  //     Toast.show({ type: 'success', text1: 'Google Login Successful 🎉' });
  //     router.replace('/root/feed');

  //   } catch (err) {
  //     console.error('Google login error:', err);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Google Login Error',
  //       text2: 'Something went wrong. Please try again.',
  //     });
  //   }
  // };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <StatusBar backgroundColor={theme.colors.primary} animated />
      <View style={{ width: '100%', flex: 1 }}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901306/fr-bg-white_hea7pb.png' }}
            style={styles.logo}
          />
        </View>
        <View style={styles.formContainer}>
          <InputField
            value={identifier.trim().toLowerCase()}
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
            textColor={theme.colors.primary}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          {/* Social login buttons */}
          <Button
            icon="https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/google-icon_sxmrhm.png"
            text="Continue with Google"
            onPress={() => {/* TODO: Google login */ }}
            style={[styles.socialButton, { backgroundColor: theme.colors.background }]}
          // override text color
          />
          <Button
            icon="https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/apple-icon_quyjuw.png"
            text="Continue with Apple"
            onPress={() => {/* TODO: Apple login */ }}
            style={[styles.socialButton, { backgroundColor: theme.colors.textPrimary }]}
            textColor={theme.colors.background}
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
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 25,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.background,
  },
  dividerText: {
    marginHorizontal: 8,
    color: theme.colors.background,
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
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  signUpLink: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
})
function loginWithGoogle(jwt: string) {
  throw new Error('Function not implemented.')
}

function saveSession(authKey: void) {
  throw new Error('Function not implemented.')
}

