import { Button, InputField } from '@/components/common';
import Header from '@/components/common/Header';
import { theme } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { debounce } from '@/utils/debounce';
import { validateOTP } from '@/utils/validation/signupValidation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const VerifyOtp: React.FC = () => {
    const router = useRouter()
    const { username, mobile } = useLocalSearchParams<{ username: string, mobile: string }>()
    const [otp, setOtp] = useState('');
    const [resending, setResending] = useState(false);
    const { verifyRegistration, register } = useAuth();

    const otpError = validateOTP(otp);
    const isValid = otpError === null;

    const handleResend = async () => {
        setResending(true);
        try {
            const resend = await register({ username, mobile })

            Toast.show({
                type: 'success',
                text1: resend.message || `OTP resent to ${mobile}`,
            })
        } catch (err: any) {
            const errorMessage = err?.data?.message || 'Fail to resend OTP.'
            Toast.show({ type: 'error', text1: errorMessage })
        } finally {
            setResending(false);
        }
    };

    const handleNext = async () => {
        setResending(true)
        const trimedOTP = otp.trim();
        if (trimedOTP.trim().length === 0) {
            Toast.show({
                type: "error",
                text1: "OTP should not be empty"
            })
        }
        try {
            const res = await verifyRegistration({ mobile, otp: trimedOTP });
            Toast.show({
                type: "success",
                text1: res.message
            })
            setTimeout(() => {
                router.push({ pathname: '/auth/register/Complete', params: { username, mobile } });
            }, 1500);
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'OTP verify fails.';
            Toast.show({
                type: "error",
                text1: errorMessage
            })
        } finally {
            setResending(false)
        }
    };

    const debouncedHandleResend = useMemo(() => debounce(handleResend, 1000), [handleResend]);
    useEffect(() => {
        return () => {
            debouncedHandleResend.cancel();
        };
    }, [debouncedHandleResend]);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={theme.colors.primary} animated barStyle={'light-content'} />
            <Header onBack={() => router.back()} title='Enter OTP' backgroundColor={theme.colors.primary} titleColor={theme.colors.background} showShadow iconColor={theme.colors.background} />
            {/* Top Section */}
            <View style={styles.topContainer}>
                <InputField
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    style={styles.input}
                />

                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text style={[styles.resendText, resending && styles.resendDisabled]}>Have not received ?</Text>
                    <TouchableOpacity disabled={resending} style={{ marginLeft: 6 }} onPress={handleResend}><Text style={{ color: theme.colors.background, fontWeight: '700' }}>Resend OTP</Text></TouchableOpacity>
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
                    debounce
                    debounceDelay={3000}
                    loaderStyle={theme.colors.textPrimary}
                    loading={resending}
                />

                <View style={styles.signInFooter}>
                    <Text style={styles.signInText}>
                        Already have an account?{' '}
                        <Text style={styles.signInLink} onPress={() => router.push('/auth/login/Login')}>
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
    },
    topContainer: {
        paddingHorizontal: 24,
    },
    title: {
        textAlign: 'center',
        fontSize: theme.fontSizes.headlineSmall,
        fontWeight: "600",
        color: theme.colors.textPrimary,
        marginBottom: 32,
    },
    input: {
        // backgroundColor: theme.colors.,
        borderRadius: 10,
        height: 50,
        marginVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 0,
    },
    resendText: {
        color: theme.colors.textPrimary,
        // textAlign: 'center',
        fontWeight: "600",
    },
    resendDisabled: {
        opacity: 0.6,
    },
    bottomContainer: {
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    button: {
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.background,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    signInFooter: {
        marginTop: 16,
        alignItems: 'center',
    },
    signInText: {
        color: theme.colors.textPrimary,
    },
    signInLink: {
        fontWeight: "600",
        color: theme.colors.background
    },
});

export default VerifyOtp;
