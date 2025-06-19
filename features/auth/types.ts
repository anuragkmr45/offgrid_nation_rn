// src/features/auth/types.ts

/** User returned by the API */
export interface User {
  _id: string
  username: string
  mobile: string
  email?: string
}

/** /auth/check-username response */
export interface UsernameCheck {
  exists: boolean
}

/** Generic payload for OTP endpoints */
export interface OtpPayload {
  username?: string
  mobile: string
}

export interface OTPVerifyPayload {
  mobile: string
  otp: string
}

/** Payload to complete registration */
export interface RegisterCompletePayload {
  mobile: string
  password: string
}

/** Response from login/register endpoints */
export interface LoginResponse {
  message: string
  token: string
  user: User
}

/** Request for social login */
export interface SocialLoginPayload {
  firebaseIdToken: string
  provider: 'apple' | 'google'
}

/** Payload for forgot-password request */
export interface ForgotPasswordPayload {
  mobile: string
}

/** Payload to reset password after OTP */
export interface ResetPasswordPayload {
  mobile: string
  newPassword: string
}

/** Payload for changing mobile number */
export interface ChangeMobilePayload {
  newMobile: string
  otp?: string
}
