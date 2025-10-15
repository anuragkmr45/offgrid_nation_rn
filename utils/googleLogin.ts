// utils/googleLogin.ts
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import * as Sentry from '@sentry/react-native';
import { useRouter } from 'expo-router';
import {
  GoogleAuthProvider,
  signInWithCredential,
  type UserCredential
} from 'firebase/auth';
import { useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../firebaseConfig';
import { OAUTH_WEB_CLIENT_ID } from './env';

/* ──────────────────────────────────────────────────
   ⚙️  Configure Google Sign-In (+ Sentry breadcrumb)
   ────────────────────────────────────────────────── */
GoogleSignin.configure({
  webClientId: OAUTH_WEB_CLIENT_ID,
  offlineAccess: false,
  scopes: ['profile', 'email'],
});

// record that configure ran (helps when native crash happens later)
Sentry.addBreadcrumb({
  category: 'auth.google',
  level: 'info',
  message: 'GoogleSignin.configure() called',
  data: {
    hasWebClientId: Boolean(OAUTH_WEB_CLIENT_ID),
    platform: Platform.OS,
  },
});

type SignedUser = { uid: string; name: string | null; email: string | null };

export function useGoogleSignIn() {
  const [user, setUser] = useState<SignedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { socialLogin } = useAuth();
  const router = useRouter();

  /* interactive account picker */
  async function promptAsync() {
    setIsLoading(true);

    // breadcrumb: flow start
    Sentry.addBreadcrumb({
      category: 'auth.google',
      level: 'info',
      message: 'promptAsync start',
    });

    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const alreadySignedIn = await GoogleSignin.getCurrentUser();
      if (alreadySignedIn) {
        Sentry.addBreadcrumb({
          category: 'auth.google',
          level: 'info',
          message: 'Found existing Google session, signing out',
        });
        await GoogleSignin.signOut();
      }

      Sentry.addBreadcrumb({
        category: 'auth.google',
        level: 'info',
        message: 'Invoking GoogleSignin.signIn()',
      });

      const res = await GoogleSignin.signIn(); // { type, data }

      Sentry.addBreadcrumb({
        category: 'auth.google',
        level: 'info',
        message: 'Google sign-in returned',
        data: { isSuccess: isSuccessResponse(res) },
      });

      if (isSuccessResponse(res)) {
        let { idToken } = res.data || {};
        if (!idToken) {
          Sentry.addBreadcrumb({
            category: 'auth.google',
            level: 'info',
            message: 'idToken missing from result, calling getTokens()',
          });
          ({ idToken } = await GoogleSignin.getTokens());
        }

        if (idToken) {
          Sentry.addBreadcrumb({
            category: 'auth.google',
            level: 'info',
            message: 'Got idToken, proceeding to Firebase sign-in',
          });
          await firebaseSignIn(idToken);
        } else {
          const e = new Error('Google sign-in succeeded but idToken is null/undefined');
          Sentry.captureException(e);
          Toast.show({ type: 'error', text1: 'Google sign-in failed to provide a token' });
        }
      }
    } catch (err: any) {
      // tag common plugin error codes
      Sentry.withScope(scope => {
        scope.setTag('auth.provider', 'google');
        if (err?.code) scope.setTag('google.code', String(err.code));
        Sentry.captureException(err);
      });

      if (err?.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err?.code === statusCodes.IN_PROGRESS) return;
      if (err?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({ type: 'error', text1: 'Google Play services not available' });
        return;
      }
      Toast.show({ type: 'error', text1: 'Google Sign-In failed' });
    } finally {
      setIsLoading(false);
      Sentry.addBreadcrumb({
        category: 'auth.google',
        level: 'info',
        message: 'promptAsync end',
      });
    }
  }

  /* exchange Google ID-token → Firebase credential */
  async function firebaseSignIn(idToken: string) {
    Sentry.addBreadcrumb({
      category: 'auth.google',
      level: 'info',
      message: 'firebaseSignIn start',
    });

    setIsLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const { user: fbUser }: UserCredential = await signInWithCredential(auth, credential);
      const { uid = '', displayName = '', email = '' } = fbUser || {};

      // optional: avoid PII; set only user id in Sentry context
      Sentry.setUser({ id: uid });

      setUser({ uid, name: displayName, email });
      await socialLogin({ firebaseUid: uid, fullName: displayName ?? '', email: email ?? '' });

      Sentry.captureMessage('Firebase sign-in success (Google)', { level: 'info' });

      router.replace('/root/feed');
    } catch (error: any) {
      Sentry.withScope(scope => {
        scope.setTag('auth.step', 'firebaseSignIn');
        Sentry.captureException(error);
      });
      const err = error?.data?.message || 'Error while Google login';
      Toast.show({ type: 'error', text1: err });
    } finally {
      setIsLoading(false);
      Sentry.addBreadcrumb({
        category: 'auth.google',
        level: 'info',
        message: 'firebaseSignIn end',
      });
    }
  }

  return { user, promptAsync, isLoading };
}
