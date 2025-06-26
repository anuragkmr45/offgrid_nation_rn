// // utils/googleLogin.ts
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { jwtDecode } from 'jwt-decode';

// WebBrowser.maybeCompleteAuthSession();

// export async function signInWithGoogleAsync(): Promise<{ idToken: string, email: string, name: string } | null> {
//   const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     clientId: CLIENT_ID,
//     iosClientId: CLIENT_ID,
//     androidClientId: CLIENT_ID,
//     webClientId: CLIENT_ID,
//   });

//   const result = await promptAsync();

//   if (result.type === 'success' && result.authentication?.idToken) {
//     const decoded: any = jwtDecode(result.authentication.idToken);
//     return {
//       idToken: result.authentication.idToken,
//       email: decoded.email,
//       name: decoded.name || 'User',
//     };
//   }

//   return null;
// }
