import { Button, Checkbox, InputField } from '@/components/common';
import { BottomSheet } from '@/components/common/BottomSheet';
import { APP_LOGO_WHITE, APPLE_ICON, GOOGLE_ICON } from '@/constants/AppConstants';
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
  ScrollView,
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

  const [isPrivacyModal, setPrivacyModal] = useState(false);
  const [identifier, setIdentifier] = useState(usernameParam || '');
  const [password, setPassword] = useState(pwdParam || '');
  const [isShowPass, setIsShowPass] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const identifierError = validateLoginUsername(identifier)
  const passwordError = validateLoginPassword(password)
  const isValid = !identifierError && !passwordError

  const ensurePolicyAccepted = () => {
    if (!isPrivacyChecked) {
      Toast.show({
        type: 'success',
        text1: 'Accept Privacy policy',
      });
      return false;
    }
    return true;
  };

  const handleSocialAuth = async () => {

  }

  const handleLogin = async () => {
    if (!ensurePolicyAccepted()) return;
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
          <Checkbox
            checked={isPrivacyChecked}
            onToggle={() => setIsPrivacyChecked(!isPrivacyChecked)}
            color={theme.colors.textPrimary}                    // bright orange
          >
            <>
              <Text style={{ color: theme.colors.textPrimary, fontWeight: 600 }}>I accept the </Text>
              <TouchableOpacity onPress={() => { setPrivacyModal(true) }}><Text style={{ color: theme.colors.background }}> Terms & Conditions</Text></TouchableOpacity>
            </>
          </Checkbox>

          <Button
            text="Log In"
            onPress={handleLogin}
            loading={isLoginLoading}
            disabled={!isPrivacyChecked || !isValid}
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
            icon={GOOGLE_ICON}
            text="Continue with Google"
            onPress={() => {
              if (!ensurePolicyAccepted()) return;
              googleSignIn();
            }}
            style={[styles.socialButton, { backgroundColor: theme.colors.background }]}
            disabled={!isPrivacyChecked || googleAuthLoading}
            loading={googleAuthLoading}
          // override text color
          />
          <Button
            icon={APPLE_ICON}
            text="Continue with Apple"
            onPress={() => {
              if (!ensurePolicyAccepted()) return;
              appleSingin();
            }}
            // onPress={() => { }}
            style={[styles.socialButton, { backgroundColor: theme.colors.textPrimary }]}
            textColor={theme.colors.background}
            disabled={!isPrivacyChecked || appleAuthLoading}
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
      <BottomSheet
        visible={isPrivacyModal}
        onClose={() => setPrivacyModal(false)}
        height="90%"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text style={{ color: theme.colors.textPrimary, lineHeight: 20 }}>
            {`Thank you for choosing to be part of our community at Offgrid Nation. This Privacy Policy explains how the mobile application “offgrid nation” collects, uses, and shares information when you install and use it on an Android device.

1. WHAT DATA WE COLLECT
• Camera: photos or video frames you capture when you take a profile photo, product image, or create a post.
• Storage / Gallery: images or videos you select from your device for listings, posts, or your profile picture.
• Precise location (GPS latitude/longitude): fetched when you open the marketplace feed so we can show nearby products.
• Push-notification token: a Firebase Cloud Messaging (FCM) device token created on first launch so we can send real-time chat and order notifications.
• Account details: e-mail address, display name, optional bio.
• User-generated content: items you list for sale, post descriptions, prices, photos.
• Payment token (via Stripe): an encrypted identifier used to process in-app purchases; we never see your full card number.
• Verification codes (via Twilio): one-time SMS codes if you choose phone verification.
• Usage and crash logs: anonymised diagnostic data (device model, OS version, feature usage) collected automatically to improve stability.
We do NOT collect your contact list, microphone audio, SMS content, or biometric identifiers.

2. WHY WE COLLECT THIS DATA
• To process payments securely and prevent fraud (Stripe).
• To improve the app: diagnose crashes and understand which screens are most useful.
• To personalise your experience: showing marketplace listings relevant to your location.
• To operate core features: posting items, updating profiles, messaging, and completing purchases.

3. WHO WE SHARE DATA WITH
• Firebase (Google LLC): cloud messaging, analytics, and crash reports.
• Pusher: delivers real-time encrypted chat messages.
• Stripe: processes in-app payments; receives only encrypted payment tokens.
• Twilio: sends SMS verification codes.
• Cloud storage (AWS S3 / Firebase Storage): hosts the images and other files you upload so they can be viewed by other users.
• Other users: see the content (photos, listings, display name, location tag) you intentionally post.
No advertiser or data broker receives your data.

4. HOW LONG WE KEEP YOUR DATA
• Marketplace posts and images – until you delete the post or request account deletion.
• Profile information – until you change it or request account deletion.
• Location look-ups and notification tokens – only while your account is active.
• Payment records (Stripe) – 7 years (required for bookkeeping).
• Crash and usage logs – up to 24 months, then aggregated or deleted.

5. YOUR CHOICES AND CONTROLS
• Runtime permissions – Android will ask the first time we need Camera, Location, or Storage access. You may decline; the related feature will be disabled. You can change this later in System Settings → Apps → offgrid nation → Permissions.
• Opt-out of analytics – toggle “Help us improve” in Settings.
• Delete or export your data – e-mail us at hello@theoffgridnation.com and we will respond within 7 days.

6. CHILDREN’S PRIVACY
The app is not directed to children under 13, and we do not knowingly collect personal data from them. If you believe a child has provided us data, contact us and we will delete it promptly.

7. SECURITY MEASURES
• End-to-end encryption for private chats.
• TLS/HTTPS on every network request.
• AES-256 encryption for images stored on our servers.
• Strong hashing and salting for passwords.
• Role-based access controls for staff.
No system is 100 % secure; please notify us immediately if you suspect unauthorised use.

8. INTERNATIONAL TRANSFERS
Our servers are located in the United States. By using the app, you consent to the transfer, storage, and processing of your information in the U.S. and any other country where we operate.

9. CHANGES TO THIS POLICY
We may update this Privacy Policy periodically. We will notify you via an in-app banner or push notification, and the new terms become effective when posted here.

10. CONTACT US
Eric / Offgrid Nation
E-mail: hello@theoffgridnation.com
Registered office: 131 Continental Dr, Suite 305, Newark, DE 19713, USA

Offgrid Nation isn’t just a name — it’s a way of life. Built to support explorers, thinkers, and freedom seekers.
Got feedback or ideas? Drop us a line anytime!

Follow us on social media and join a growing nation of independent minds.
Facebook  ·  X/Twitter  ·  LinkedIn  ·  Instagram  ·  YouTube  ·  Reddit

© Offgridnation 2025. All Rights Reserved.`}
          </Text>
        </ScrollView>
      </BottomSheet>

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
    marginBottom: 10,
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