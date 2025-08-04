import * as AppleAuthentication from 'expo-apple-authentication';
import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from 'expo-crypto';
import { getAuth, OAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
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

    const signIn = async () => {
        if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) {
            Toast.show({ type: 'info', text1: "'Apple Sign-In is not available on this device" })
            return;
        }

        setIsLoading(true)
        try {
            // 1. Generate nonces
            const rawNonce = randomUUID();
            const hashedNonce = await digestStringAsync(CryptoDigestAlgorithm.SHA256, rawNonce);

            // 2. Prompt Apple sign-in
            const appleResponse = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            });

            // 3. Exchange for Firebase credential
            const { identityToken, fullName, email } = appleResponse || {};
            if (!identityToken) throw new Error('Apple Sign-In failed to return identityToken');

            const provider = new OAuthProvider('apple.com');
            const firebaseCred = provider.credential({
                idToken: identityToken,
                rawNonce: rawNonce,
            });

            const auth = getAuth();
            const userCred: UserCredential = await signInWithCredential(auth, firebaseCred);

            // 4. Extract and store user data
            const { user: { uid = "", displayName = "", email: emailFromUserCred } } = userCred || {};
            setUserData({
                uid,
                name: displayName || fullName?.familyName || '',
                email: emailFromUserCred || email || '',
            });
        } catch (err: any) {
            if (err.code === 'ERR_REQUEST_CANCELED') {
                return
            } else {
                console.error('Apple sign-in error:', err);
            }
        } finally {
            setIsLoading(false)
        }
    };

    return { userData, signIn, isLoading };
}
