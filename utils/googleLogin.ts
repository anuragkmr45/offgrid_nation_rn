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
import { auth } from '../firebaseConfig';

/* ──────────────────────────────────────────────────
   ⚙️  Configure Google Sign-In
   ────────────────────────────────────────────────── */
GoogleSignin.configure({
  webClientId:
    '758180883916-m361lt4ju30lm48pss3lk6ja78g8bsm2.apps.googleusercontent.com',
  iosClientId:
    '758180883916-0uavc2mn583050i6hp91ukcc4o87f2t2.apps.googleusercontent.com',
  offlineAccess: false,
  scopes: ['profile', 'email'],
});

type SignedUser = { uid: string; name: string | null; email: string | null };

/* ──────────────────────────────────────────────────
   📲  Hook: useGoogleSignIn
   ────────────────────────────────────────────────── */
export function useGoogleSignIn() {
  const [user, setUser] = useState<SignedUser | null>(null);
  const { socialLogin } = useAuth();
  const router = useRouter();
  /* silent sign-in on mount */
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await GoogleSignin.signInSilently();
  //       const { idToken } = await GoogleSignin.getTokens();
  //       if (idToken) await firebaseSignIn(idToken);

  //     } catch {
  //       /* no cached credentials */
  //     }
  //   })();
  // }, []);

  /* interactive account picker */
  async function promptAsync() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      await GoogleSignin.signIn(); // GoogleUser
      const { idToken } = await GoogleSignin.getTokens();
      if (idToken) await firebaseSignIn(idToken);
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;            // user cancelled
      if (err.code === statusCodes.IN_PROGRESS) return;                  // already running
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.warn('Play services not available');
        return;
      }
      console.error('GoogleSignin error', err);
    }
  }

  /* exchange Google ID-token → Firebase credential */
  async function firebaseSignIn(idToken: string) {
    const credential = GoogleAuthProvider.credential(idToken);
    const { user: fbUser }: UserCredential = await signInWithCredential(
      auth,
      credential,
    );
    setUser({
      uid: fbUser.uid,
      name: fbUser.displayName,
      email: fbUser.email,
    });
    await socialLogin({ firebaseUid: fbUser.uid, fullName: fbUser.displayName ?? '', email: fbUser.email ?? '' })
    // only runs if unwrap() succreeded
    router.replace('/root/feed')
  }

  /* match the signature you use elsewhere:
     const { user, promptAsync } = useGoogleSignIn(); */
  return { user, promptAsync };
}
