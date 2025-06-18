// src/store/store.ts
import { authApi } from '@/features/auth/api/authApi'
import { chatApi } from '@/features/chat/api/chatApi'
import { commentApi } from '@/features/content/comment/api/commentApi'
import { feedApi } from '@/features/content/feed/api/feedApi'
import { postApi } from '@/features/content/post/api/postApi'
import { listApi } from '@/features/list/api/listApi'
import { notificationsApi } from '@/features/notifications/api/notificationsApi'
import { productsApi } from '@/features/products/api/productsApi'
import { profileApi } from '@/features/profile/api/profileApi'
import { socialApi } from '@/features/social/api/socialApi'
import { premiumApi } from '@/features/subscription/api/premiumApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import { rootReducer } from './rootReducer'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // keep serializableCheck on, to catch mistakes
      serializableCheck: { ignoredActions: ['persist/PERSIST'] },
    })
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(socialApi.middleware)
      .concat(listApi.middleware)
      .concat(premiumApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(postApi.middleware)
      .concat(commentApi.middleware)
      .concat(feedApi.middleware)
      .concat(productsApi.middleware)
      .concat(chatApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
