import { Button, InputField } from '@/components/common';
import { theme } from '@/constants/theme';
import { validateOTP } from '@/utils/validation/signupValidation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VerifyOtp: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);

  // validate OTP
  const otpError = validateOTP(otp);
  const isValid = otpError === null;

  const handleResend = async () => {
    setResending(true);
    // TODO: resend reset OTP
    setResending(false);
  };

  const handleNext = () => {
    // TODO: verify reset OTP
    router.push('/auth/forgot-password/Reset');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.background} />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.topContainer}>
          <Text style={styles.title}>OTP Code Verification</Text>
          <Text style={styles.subtitle}>
            We have sent an OTP code to your email. Enter the OTP code below to verify.
          </Text>

          <InputField
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter your OTP"
            keyboardType="number-pad"
            style={styles.input}
          />
          {otpError && <Text style={styles.errorText}>{otpError}</Text>}

          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={[styles.resendText, resending && { opacity: 0.5 }]}>Didn't receive email? Resend.</Text>
          </TouchableOpacity>
        </View>

        {/* Footer button */}
        <View style={styles.bottomContainer}>
          <Button
            text="Continue"
            onPress={handleNext}
            disabled={!isValid}
            style={[styles.button, !isValid && styles.buttonDisabled]}
            textColor={theme.colors.primary}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 22,
    justifyContent: 'flex-start',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSizes.displaySmall,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.background,
    marginBottom: 24,
  },
  input: {
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 15,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 4,
    color: theme.colors.background,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 12,
    marginBottom: 4,
  },
  resendText: {
    color: theme.colors.textPrimary,
    marginTop: 8,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.textPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default VerifyOtp;
