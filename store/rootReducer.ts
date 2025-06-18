// src/store/rootReducer.ts
import { authApi } from '@/features/auth/api/authApi'
import authReducer from '@/features/auth/slice/authSlice'
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
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [socialApi.reducerPath]: socialApi.reducer,
  [listApi.reducerPath]: listApi.reducer,
  [premiumApi.reducerPath]: premiumApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [feedApi.reducerPath]: feedApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
})

export type RootState = ReturnType<typeof rootReducer>