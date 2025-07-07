// utils/googleLogin.ts

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

// Firebase config (you can replace with env vars or secure methods)
const firebaseConfig = {
  apiKey: "AIzaSyCkmvEHFlDn01G2poD61lJXsVg3_i2DwWo",
  authDomain: "offgrid-nation.firebaseapp.com",
  databaseURL: "https://offgrid-nation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "offgrid-nation",
  storageBucket: "offgrid-nation.firebasestorage.app",
  messagingSenderId: "758180883916",
  appId: "1:758180883916:android:8c1cb81f28074914964169",
};

initializeApp(firebaseConfig);

/**
 * Custom hook that sets up Google sign-in and provides a function to trigger it,
 * along with the result when available.
 */
export function useGoogleSignIn() {
  const [userData, setUserData] = useState<{ uid: string; name: string; email: string } | null>(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "758180883916-m361lt4ju30lm48pss3lk6ja78g8bsm2.apps.googleusercontent.com", // Web
    iosClientId: "758180883916-0uavc2mn583050i6hp91ukcc4o87f2t2.apps.googleusercontent.com",
    androidClientId: "758180883916-rc2v435b4em5medgkkun30jo2gbece6a.apps.googleusercontent.com",
    selectAccount: true,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === 'success' && response.params.id_token) {
        const idToken = response.params.id_token;
        const credential = GoogleAuthProvider.credential(idToken);
        const auth = getAuth();
        const userCred: UserCredential = await signInWithCredential(auth, credential);
        const user = userCred.user;
        const data = {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
        };
        console.log('Google sign-in success:', data);
        setUserData(data);
      }
    })();
  }, [response]);

  return { request, userData, promptAsync };
}