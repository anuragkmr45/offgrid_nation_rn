import { Button, InputField } from '@/components/common';
import { APP_LOGO_WHITE } from '@/constants/AppConstants';
import { theme } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppleSignIn } from '@/utils/appleSignIn';
import { useGoogleSignIn } from '@/utils/googleLogin';
import { validateLoginPassword, validateLoginUsername } from '@/utils/validation/loginValidation';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const router = useRouter()
  const { username: usernameParam, password: pwdParam } = useLocalSearchParams<{
    username?: string;
    password?: string;
  }>()
  const { promptAsync: googleSignIn, isLoading: googleAuthLoading } = useGoogleSignIn();
  const { signIn: appleSingin, isLoading: appleAuthLoading } = useAppleSignIn()

  const { login, isLoginLoading } = useAuth()
  const [identifier, setIdentifier] = useState(usernameParam || '');
  const [password, setPassword] = useState(pwdParam || '');
  const [isShowPass, setIsShowPass] = useState(false);

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
      const errorMessage = err?.data?.message || 'Login failed, please try again.';
      Toast.show({
        type: 'error',
        text1: errorMessage,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <StatusBar backgroundColor={theme.colors.primary} animated />
      <View style={{ width: '100%', flex: 1 }}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: APP_LOGO_WHITE }}
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
          <View style={styles.passwordWrapper}>
            <InputField
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!isShowPass}
              style={{ paddingRight: 40, color: theme.colors.textPrimary }}           // make room for the icon
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsShowPass(prev => !prev)}
            >
              <Ionicons
                name={isShowPass ? 'eye-off' : 'eye'}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
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
            onPress={() => googleSignIn()}
            style={[styles.socialButton, { backgroundColor: theme.colors.background }]}
            disabled={googleAuthLoading}
            loading={googleAuthLoading}
          // override text color
          />
          <Button
            icon="https://res.cloudinary.com/dkwptotbs/image/upload/v1750237689/apple-icon_quyjuw.png"
            text="Continue with Apple"
            onPress={appleSingin}
            // onPress={() => { }}
            style={[styles.socialButton, { backgroundColor: theme.colors.textPrimary }]}
            textColor={theme.colors.background}
            disabled={appleAuthLoading}
            loading={appleAuthLoading}
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
  passwordWrapper: {
    position: 'relative',
    marginTop: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '40%',
    transform: [{ translateY: -12 }],
    padding: 4,
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