import { useAuth } from '@/features/auth/hooks/useAuth';
import { auth } from '@/firebaseConfig';
import * as Sentry from '@sentry/react-native'; // ⬅️ added
import * as AppleAuthentication from 'expo-apple-authentication';
import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { OAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
import { useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export function useAppleSignIn() {
  const [userData, setUserData] = useState<{
    uid: string;
    name: string;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { socialLogin } = useAuth();
  const router = useRouter();

  const signIn = async () => {
    Sentry.addBreadcrumb({
      category: 'auth.apple',
      level: 'info',
      message: 'signIn invoked',
      data: { platform: Platform.OS },
    });

    if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) {
      Sentry.addBreadcrumb({
        category: 'auth.apple',
        level: 'info',
        message: 'Apple Sign-In not available on this device',
      });
      Toast.show({ type: 'info', text1: "'Apple Sign-In is not available on this device" });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Generate nonces
      const rawNonce = randomUUID();
      const hashedNonce = await digestStringAsync(CryptoDigestAlgorithm.SHA256, rawNonce);
      Sentry.addBreadcrumb({
        category: 'auth.apple',
        level: 'info',
        message: 'Nonce generated',
        data: { hasRawNonce: Boolean(rawNonce), hasHashedNonce: Boolean(hashedNonce) },
      });

      // 2. Prompt Apple sign-in
      Sentry.addBreadcrumb({
        category: 'auth.apple',
        level: 'info',
        message: 'AppleAuthentication.signInAsync called',
      });
      const appleResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      Sentry.addBreadcrumb({
        category: 'auth.apple',
        level: 'info',
        message: 'Apple sign-in returned',
        data: {
          hasIdentityToken: Boolean((appleResponse as any)?.identityToken),
          providedEmail: Boolean((appleResponse as any)?.email),
          providedFullName: Boolean((appleResponse as any)?.fullName),
        },
      });

      // 3. Exchange for Firebase credential
      const { identityToken, fullName, email } = appleResponse || {};
      if (!identityToken) {
        Sentry.withScope(scope => {
          scope.setTag('auth.provider', 'apple');
          scope.setTag('auth.step', 'identityToken');
          scope.setLevel('error');
          Sentry.captureMessage('Apple Sign-In missing identityToken');
        });
        throw new Error('Apple Sign-In failed to return identityToken');
      }

      Sentry.addBreadcrumb({
        category: 'auth.apple',
        level: 'info',
        message: 'Firebase credential sign-in start',
      });
      const provider = new OAuthProvider('apple.com');
      const firebaseCred = provider.credential({
        idToken: identityToken,
        rawNonce: rawNonce,
      });

      const userCred: UserCredential = await signInWithCredential(auth, firebaseCred);

      // 4. Extract and store user data
      const { user: { uid = "", displayName = "", email: emailFromUserCred } } = userCred || {};
      setUserData({
        uid,
        name: displayName || fullName?.familyName || '',
        email: emailFromUserCred || email || '',
      });

      // set Sentry user (no PII beyond uid by default)
      Sentry.setUser({ id: uid });

      await socialLogin({ firebaseUid: uid, fullName: displayName ?? '', email: email ?? '' });
      Sentry.captureMessage('Firebase sign-in success (Apple)', { level: 'info' });

      router.replace('/root/feed');

    } catch (err: any) {
      // Distinguish user cancel vs error
      if (err?.code === 'ERR_REQUEST_CANCELED') {
        Sentry.addBreadcrumb({
          category: 'auth.apple',
          level: 'info',
          message: 'User canceled Apple sign-in',
        });
        return;
      }

      Sentry.withScope(scope => {
        scope.setTag('auth.provider', 'apple');
        scope.setTag('auth.step', 'signIn');
        if (err?.code) scope.setTag('apple.code', String(err.code));
        scope.setExtra('errorMessage', String(err?.message ?? ''));
        Sentry.captureException(err);
      });
      console.error('Apple sign-in error:', err);
    } finally {
      setIsLoading(false);
      Sentry.addBreadcrumb({
        category: 'auth.apple',
        level: 'info',
        message: 'signIn end',
      });
    }
  };

  return { userData, signIn, isLoading };
}
