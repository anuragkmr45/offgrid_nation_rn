// utils/googleLogin.ts
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import {
  GoogleAuthProvider,
  signInWithCredential,
  type UserCredential
} from 'firebase/auth';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { auth } from '../firebaseConfig';
import { IOS_CLIENT_ID, OAUTH_WEB_CLIENT_ID } from './env';

/* ──────────────────────────────────────────────────
   ⚙️  Configure Google Sign-In
   ────────────────────────────────────────────────── */
GoogleSignin.configure({
  webClientId: OAUTH_WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  offlineAccess: false,
  scopes: ['profile', 'email'],
});

type SignedUser = { uid: string; name: string | null; email: string | null };

/* ──────────────────────────────────────────────────
   📲  Hook: useGoogleSignIn
   ────────────────────────────────────────────────── */
export function useGoogleSignIn() {
  const [user, setUser] = useState<SignedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { socialLogin } = useAuth();
  const router = useRouter();

  /* interactive account picker */
  async function promptAsync() {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const alreadySignedIn = GoogleSignin.getCurrentUser();
      if (alreadySignedIn) {
        await GoogleSignin.signOut();
      }

      await GoogleSignin.signIn(); // GoogleUser
      const { idToken } = await GoogleSignin.getTokens();
      if (idToken) await firebaseSignIn(idToken);
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;            // user cancelled
      if (err.code === statusCodes.IN_PROGRESS) return;                  // already running
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({ type: "error", text1: "Google Play services not available" })
        return;
      }
    } finally {
      setIsLoading(false)
    }
  }

  /* exchange Google ID-token → Firebase credential */
  async function firebaseSignIn(idToken: string) {
    setIsLoading(true)
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const { user: fbUser }: UserCredential = await signInWithCredential(
        auth,
        credential,
      );
      const { uid = "", displayName = "", email = "" } = fbUser || {}
      console.log({ uid, displayName, email });

      setUser({
        uid: uid,
        name: displayName,
        email: email,
      });
      await socialLogin({ firebaseUid: uid, fullName: displayName ?? "", email: email ?? "" });
      // only runs if unwrap() succreeded
      router.replace('/root/feed')
    } catch (error: any) {
      const err = error?.data?.message || "Error while google login"
      Toast.show({ type: 'error', text1: err })
    } finally {
      setIsLoading(false)
    }
  }

  /* match the signature you use elsewhere:
     const { user, promptAsync } = useGoogleSignIn(); */
  return { user, promptAsync, isLoading };
}
