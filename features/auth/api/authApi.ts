// src/features/auth/api/authApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  ChangeMobilePayload,
  ForgotPasswordPayload,
  LoginResponse,
  OtpPayload,
  RegisterCompletePayload,
  ResetPasswordPayload,
  SocialLoginPayload,
  UsernameCheck,
} from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: [],
  endpoints: (build) => ({
    // 1. Check Username Availability
    checkUsername: build.query<UsernameCheck, string>({
      query: (username) => ({
        url: '/auth/check-username',
        method: 'GET',
        params: { username },
      }),
    }),

    // 2.1 Registration – Send OTP
    sendRegisterOtp: build.mutation<{ message: string }, OtpPayload>({
      query: (body) => ({ url: '/auth/register/send-otp', method: 'POST', body }),
    }),

    // 2.2 Registration – Verify OTP
    verifyRegisterOtp: build.mutation<{ message: string }, OtpPayload>({
      query: (body) => ({ url: '/auth/register/verify-otp', method: 'POST', body }),
    }),

    // 2.3 Registration – Complete
    completeRegistration: build.mutation<LoginResponse, RegisterCompletePayload>({
      query: (body) => ({ url: '/auth/register/complete', method: 'POST', body }),
    }),

    // 2.6 Login – JWT-Based
    login: build.mutation<LoginResponse, { loginId: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        // arg is { loginId, password }
        console.log('--------------------------------------------[authApi.login] called with:', arg);

        try {
          const { data } = await queryFulfilled;
          console.log('--------------------------------------------[authApi.login] response data:', data);
        } catch (err) {
          console.error('[authApi.login] error:', err);
        }
      }
    }),

    // 2.7 Social Login
    socialLogin: build.mutation<LoginResponse, SocialLoginPayload>({
      query: (body) => ({ url: '/auth/social-login', method: 'POST', body }),
    }),

    // 2.8 Forgot Password – Send OTP
    forgotPassword: build.mutation<{ message: string }, ForgotPasswordPayload>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),

    // 2.9 Verify Forgot-Password OTP
    verifyForgotPasswordOtp: build.mutation<{ message: string }, OtpPayload>({
      query: (body) => ({ url: '/auth/verify-forgot-password-otp', method: 'POST', body }),
    }),

    // 2.10 Reset Password
    resetPassword: build.mutation<{ message: string }, ResetPasswordPayload>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    // 2.11 Change Number – Send OTP
    sendChangeMobileOtp: build.mutation<{ message: string }, ChangeMobilePayload>({
      query: (body) => ({ url: '/auth/mobile/send-otp', method: 'POST', body }),
    }),

    // 2.12 Verify Mobile Change OTP
    verifyChangeMobile: build.mutation<{ message: string }, ChangeMobilePayload>({
      query: (body) => ({ url: '/auth/mobile/verify-otp', method: 'POST', body }),
    }),
  }),
});

export const {
  useCheckUsernameQuery,
  useLazyCheckUsernameQuery,
  useSendRegisterOtpMutation,
  useVerifyRegisterOtpMutation,
  useCompleteRegistrationMutation,
  useLoginMutation,
  useSocialLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useSendChangeMobileOtpMutation,
  useVerifyChangeMobileMutation,
} = authApi;
