// // src/core/api/baseQueryWithLogoutOn401.ts
// import { authApi } from '@/features/auth/api/authApi'
// import { logout } from '@/features/auth/slice/authSlice'
// import { profileApi } from '@/features/profile/api/profileApi'
// import { socialApi } from '@/features/social/api/socialApi'
// import type { RootState } from '@/store/store'
// import type { BaseQueryFn } from '@reduxjs/toolkit/query'
// import {
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from '@reduxjs/toolkit/query/react'

// export const baseQuery = fetchBaseQuery({
//   // baseUrl: process.env.API_URL,
//   baseUrl: "https://api.theoffgridnation.com",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.accessToken
//     if (token) headers.set('authorization', `Bearer ${token}`)
//     return headers
//   },
// })

// export const baseQueryWithLogoutOn401: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   const result = await baseQuery(args, api, extraOptions)

//   if (result.error?.status === 401) {
//     api.dispatch(logout())
//     api.dispatch(authApi.util.resetApiState())
//     api.dispatch(profileApi.util.resetApiState())
//     api.dispatch(socialApi.util.resetApiState());
//   }

//   return result
// }


// src/core/api/baseQueryWithLogoutOn401.ts
import { logout } from '@/features/auth/slice/authSlice'
import type { RootState } from '@/store/store'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.theoffgridnation.com',
  // baseUrl: 'https://fc52-119-235-52-196.ngrok-free.app',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const baseQueryWithLogoutOn401: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // Just logout; reset other APIs elsewhere
    api.dispatch(logout())
  }

  return result
}
