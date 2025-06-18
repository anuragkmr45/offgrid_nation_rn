export function validateLoginUsername(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Please enter your username, phone, or email';
  }
  return null;
}

export function validateLoginPassword(value: string): string | null {
  if (!value || value.length === 0) {
    return 'Please enter your password';
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
