// utils/firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCkmvEHFlDn01G2poD61lJXsVg3_i2DwWo',
  authDomain: 'offgrid-nation.firebaseapp.com',
  databaseURL:
    'https://offgrid-nation-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'offgrid-nation',
  storageBucket: 'offgrid-nation.firebasestorage.app',
  messagingSenderId: '758180883916',
  appId: '1:758180883916:android:026b1da1e09886d3964169',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
