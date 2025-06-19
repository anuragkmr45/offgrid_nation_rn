// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  useCompleteRegistrationMutation,
  useForgotPasswordMutation,
  useLazyCheckUsernameQuery,
  useLoginMutation,
  useResetPasswordMutation,
  useSendChangeMobileOtpMutation,
  useSendRegisterOtpMutation,
  useSocialLoginMutation,
  useVerifyChangeMobileMutation,
  useVerifyForgotPasswordOtpMutation,
  useVerifyRegisterOtpMutation,
} from '../api/authApi'
import { logout as logoutAction, setCredentials } from '../slice/authSlice'
import type {
  ChangeMobilePayload,
  ForgotPasswordPayload,
  OtpPayload,
  OTPVerifyPayload,
  RegisterCompletePayload,
  ResetPasswordPayload,
  SocialLoginPayload,
} from '../types'

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  // Lazy query for username availability
  const [triggerUsernameCheck, { data: usernameCheck, isLoading: isCheckingUsername }] =
    useLazyCheckUsernameQuery()

  // Mutations
  const [sendRegisterOtp, { isLoading: isSendingRegisterOtp, error: registerOtpError }] =
    useSendRegisterOtpMutation()
  const [verifyRegisterOtp, { isLoading: isVerifyingRegisterOtp, error: verifyOtpError }] =
    useVerifyRegisterOtpMutation()
  const [completeRegistration, { isLoading: isCompletingRegistration, error: completeRegError }] =
    useCompleteRegistrationMutation()
  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation()
  const [socialLoginMutation, { isLoading: isSocialLoading, error: socialError }] =
    useSocialLoginMutation()
  const [forgotPassword, { isLoading: isForgotLoading, error: forgotError }] =
    useForgotPasswordMutation()
  const [verifyForgotOtp, { isLoading: isVerifyingForgotOtp, error: forgotOtpError }] =
    useVerifyForgotPasswordOtpMutation()
  const [resetPassword, { isLoading: isResetLoading, error: resetError }] =
    useResetPasswordMutation()
  const [sendChangeMobileOtp, { isLoading: isSendingChangeMobileOtp, error: changeMobileOtpError }] =
    useSendChangeMobileOtpMutation()
  const [verifyChangeMobile, { isLoading: isVerifyingChangeMobile, error: changeMobileError }] =
    useVerifyChangeMobileMutation()

  // Callbacks
  const checkUsername = useCallback(
    (username: string) => triggerUsernameCheck(username),
    [triggerUsernameCheck]
  )

  const register = useCallback(
    (payload: OtpPayload) => sendRegisterOtp(payload).unwrap(),
    [sendRegisterOtp]
  )

  const verifyRegistration = useCallback(
    (payload: OTPVerifyPayload) => verifyRegisterOtp(payload).unwrap(),
    [verifyRegisterOtp]
  )

  const completeRegistrationFlow = useCallback(
    async (payload: RegisterCompletePayload) => {
      const { token, user: newUser } = await completeRegistration(payload).unwrap()
      dispatch(setCredentials({ user: newUser, accessToken: token }))
    },
    [completeRegistration, dispatch]
  )

  const login = useCallback(
    async (credentials: { loginId: string; password: string }) => {
      const { token, user: loggedInUser } = await loginMutation(credentials).unwrap()
      dispatch(setCredentials({ user: loggedInUser, accessToken: token }))
    },
    [loginMutation, dispatch]
  )

  const socialLogin = useCallback(
    async (payload: SocialLoginPayload) => {
      const { token, user: socialUser } = await socialLoginMutation(payload).unwrap()
      dispatch(setCredentials({ user: socialUser, accessToken: token }))
    },
    [socialLoginMutation, dispatch]
  )

  const triggerForgotPassword = useCallback(
    (payload: ForgotPasswordPayload) => forgotPassword(payload).unwrap(),
    [forgotPassword]
  )

  const triggerVerifyForgotOtp = useCallback(
    (payload: OTPVerifyPayload) => verifyForgotOtp(payload).unwrap(),
    [verifyForgotOtp]
  )

  const triggerResetPassword = useCallback(
    (payload: ResetPasswordPayload) => resetPassword(payload).unwrap(),
    [resetPassword]
  )

  const triggerChangeMobile = useCallback(
    (payload: ChangeMobilePayload) => sendChangeMobileOtp(payload).unwrap(),
    [sendChangeMobileOtp]
  )

  const triggerVerifyChangeMobile = useCallback(
    (payload: ChangeMobilePayload) => verifyChangeMobile(payload).unwrap(),
    [verifyChangeMobile]
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  return {
    user,
    // Username
    usernameCheck,
    isCheckingUsername,
    checkUsername,
    // Registration
    isSendingRegisterOtp,
    register,
    isVerifyingRegisterOtp,
    verifyRegistration,
    isCompletingRegistration,
    completeRegistrationFlow,
    // Login
    isLoginLoading,
    login,
    loginError,
    // Social
    isSocialLoading,
    socialLogin,
    socialError,
    // Forgot / Reset
    triggerForgotPassword,
    isForgotLoading,
    forgotError,
    isVerifyingForgotOtp,
    triggerVerifyForgotOtp,
    forgotOtpError,
    isResetLoading,
    triggerResetPassword,
    resetError,
    // Change Mobile
    isSendingChangeMobileOtp,
    triggerChangeMobile,
    changeMobileOtpError,
    isVerifyingChangeMobile,
    triggerVerifyChangeMobile,
    changeMobileError,
    // Logout
    logout,
  }
}
