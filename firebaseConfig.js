// src/firebaseConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkmvEHFlDn01G2poD61lJXsVg3_i2DwWo",
  authDomain: "offgrid-nation.firebaseapp.com",
  projectId: "offgrid-nation",
  storageBucket: "offgrid-nation.appspot.com",
  messagingSenderId: "758180883916",
  appId: "1:758180883916:android:17ea7cc279f3d5c1964169",
  databaseURL:
    "https://offgrid-nation-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

// ← use React Native AsyncStorage instead of default “memory” persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
