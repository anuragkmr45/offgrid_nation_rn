// src/core/api/baseQueryWithLogoutOn401.ts
import { logoutAndRedirect } from '@/features/auth/slice/authSlice'
import type { RootState } from '@/store/store'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://apiv2.theoffgridnation.com',
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
    api.dispatch(logoutAndRedirect ())

  }

  return result
}
