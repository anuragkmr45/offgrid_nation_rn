import { Button } from '@/components/common';
import Header from '@/components/common/Header';
import OtpInput from '@/components/common/OtpInput ';
import { theme } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validateOTP } from '@/utils/validation/signupValidation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const VerifyOtp: React.FC = () => {
  const router = useRouter();
  const { mobile } = useLocalSearchParams<{ mobile: string }>()
  const [otp, setOtp] = useState('');
  const [isLoading, setIslanding] = useState(false);
  const { triggerVerifyForgotOtp, triggerForgotPassword } = useAuth();

  // validate OTP
  const otpError = validateOTP(otp);
  const isValid = otpError === null;

  const handleResend = async () => {
    setIslanding(true);
    try {
      const resend = await triggerForgotPassword({ mobile })

      Toast.show({
        type: 'success',
        text1: resend.message || `OTP resent to ${mobile}`,
      })
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Fail to resend OTP.'
      Toast.show({ type: 'error', text1: errorMessage })
    } finally {
      setIslanding(false);
    }
  };

  const handleNext = async () => {
    setIslanding(true)
    const trimedOTP = otp.trim();
    try {
      // await triggerVerifyForgotOtp({ mobile: mobile, otp: trimedOTP });
      // Toast.show({
      //   type: "success",
      //   text1: "OTP verified"
      // })
      setTimeout(() => {
        router.push({ pathname: '/auth/forgot-password/Reset', params: { mobile: "csd" } });
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'OTP verification fails.';
      Toast.show({
        type: "error",
        text1: errorMessage
      })
    } finally {
      setIslanding(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar animated backgroundColor={theme.colors.primary} barStyle={'light-content'} />
        <Header
          // title="Registeration"
          onBack={() => router.back()}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.background}
          iconColor={theme.colors.background}
        // showShadow
        />

        {/* Main content */}
        <View style={styles.topContainer}>
          <Text style={styles.title}>OTP Code Verification</Text>
          <Text style={styles.subtitle}>
            We have sent an OTP code to your email. Enter the OTP code below to verify.
          </Text>

          {/* <InputField
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter your OTP"
            keyboardType="number-pad"
            style={styles.input}
          /> */}
          <OtpInput
            length={6}
            onChange={setOtp}
            containerStyle={styles.input}
            boxStyle={{ borderColor: theme.colors.background}}
          />
          {otpError && <Text style={styles.errorText}>{otpError}</Text>}

          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Text style={[styles.resendText, isLoading && styles.resendDisabled]}>Have not received ?</Text>
            <TouchableOpacity disabled={isLoading} style={{ marginLeft: 6 }} onPress={handleResend}><Text style={{ color: theme.colors.background, fontWeight: '700' }}>Resend OTP</Text></TouchableOpacity>
          </View>
        </View>

        {/* Footer button */}
        <View style={styles.bottomContainer}>
          <Button
            text="Continue"
            onPress={handleNext}
            disabled={!isValid || isLoading}
            style={[styles.button, !isValid && styles.buttonDisabled]}
            textColor={theme.colors.primary}
            debounce
            loaderStyle={theme.colors.textPrimary}
            loading={isLoading}
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
    fontWeight: "700",
    color: theme.colors.background,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.background,
    marginBottom: 24,
  },
  input: {
    // backgroundColor: theme.colors.background,
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
  },
  resendDisabled: {
    opacity: 0.6,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default VerifyOtp;
