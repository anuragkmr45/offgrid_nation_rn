import * as AppleAuthentication from 'expo-apple-authentication';
import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from 'expo-crypto';
import { getAuth, OAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
import { useState } from 'react';

export function useAppleSignIn() {
    const [userData, setUserData] = useState<{
        uid: string;
        name: string;
        email: string;
    } | null>(null);

    const signIn = async () => {
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
            const { identityToken, fullName, email } = appleResponse;
            if (!identityToken) throw new Error('Apple Sign-In failed to return identityToken');

            const provider = new OAuthProvider('apple.com');
            const firebaseCred = provider.credential({
                idToken: identityToken,
                rawNonce: rawNonce,
            });

            const auth = getAuth();
            const userCred: UserCredential = await signInWithCredential(auth, firebaseCred);

            // 4. Extract and store user data
            const { uid, displayName } = userCred.user;
            setUserData({
                uid,
                name: displayName || fullName?.familyName || '',
                email: userCred?.user?.email || email || '',
            });
        } catch (err) {
            if ((err as any).code === 'ERR_REQUEST_CANCELED') {
                // user cancelled
            } else {
                console.error('Apple sign-in error:', err);
            }
        }
    };

    return { userData, signIn };
}
