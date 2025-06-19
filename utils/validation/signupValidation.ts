export function validateUsername(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Please enter a username';
  }
  return null;
}

export function validatePhone(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Please enter a phone number';
  }
  if (!/^\d{10}$/.test(value.trim())) {
    return 'Please enter a valid 10-digit phone number';
  }
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Please enter an email';
  }
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(value.trim())) {
    return 'Please enter a valid email';
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value || value.length === 0) {
    return 'Please enter a password';
  }
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return 'Password must contain at least one special character';
  }
  return null;
}

export function validateConfirmPassword(value: string, original: string): string | null {
  if (!value || value.length === 0) {
    return 'Please confirm your password';
  }
  if (value !== original) {
    return 'Passwords do not match';
  }
  return null;
}

export function validateOTP(value: string): string | null {
  if (!value) {
    return 'Please enter the OTP';
  }
  if (value.length !== 6) {
    return 'OTP must be exactly 4 digits';
  }
  return null;
}
