import { Button, InputField } from '@/components/common';
import { theme } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validatePhone, validateUsername } from '@/utils/validation/signupValidation';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const SendOtp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState<'US' | 'IN'>('US');
  const [callingCode, setCallingCode] = useState<string[]>('1'.split(','));

  const {
    checkUsername,
    register
  } = useAuth()


  const isValid = validateUsername(username) === null && validatePhone(phone) === null;

  const handleNext = async () => {
    try {
      const trimedUsername = username.trim().toLowerCase();
      const data = await checkUsername(trimedUsername).unwrap()

      if (!!data.exists === true) {
        const phoneWithCountryCode = `+${callingCode} ${phone}`;
        const reg = await register({username: trimedUsername, mobile:phoneWithCountryCode});
        Toast.show({
          type: 'success',
          text1: reg.message,
        });
        setTimeout(() => {
          router.push({pathname: '/auth/register/VerifyOtp', params: { mobile: phoneWithCountryCode }})
        }, 2000)
      } else {
        Toast.show({
          type: 'error',
          text1: 'username not avaiable',
        });
      }
    } catch (err: any) {

      const errorMessage = err?.data?.message || 'OTP send fails.';
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
      });
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} animated />
      {/* Top Section */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Create an Account</Text>

        <InputField
          value={username.trim().toLowerCase()}
          onChangeText={setUsername}
          placeholder="User name"
        //   style={styles.input}
        />

        <View style={styles.phoneContainer}>
          <CountryPicker
            countryCode={countryCode}
            withCallingCode
            withFilter
            onSelect={(c: Country) => {
              setCountryCode('US');
              setCallingCode(c.callingCode);
            }}
            containerButtonStyle={styles.countryPicker}

          />
          <InputField
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Button
          onPress={handleNext}
          text="Next"
          disabled={!isValid}
          style={[styles.button, !isValid && styles.buttonDisabled]}
          textColor={theme.colors.primary}
        />

        <View style={styles.signInFooter}>
          <Text style={styles.signInText}>
            Already have an account? {' '}
            <Text
              style={styles.signInLink}
              onPress={() => router.back()}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  topContainer: {
    marginTop: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSizes.headlineSmall,
    fontWeight: "600",
    color: theme.colors.background,
    marginBottom: 32,
  },
  input: {
    borderRadius: 10,
    height: 50,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 0,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  countryPicker: {
    padding: 0,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    height: 50,
  },
  bottomContainer: {
    paddingBottom: 24,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signInFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  signInText: {
    color: theme.colors.textPrimary,
    fontWeight: "600"
  },
  signInLink: {
    fontWeight: "600",
    color: theme.colors.background,
  },
});

export default SendOtp;
