import { Button, InputField } from '@/components/common';
import { theme } from '@/constants/theme';
import { validateOTP } from '@/utils/validation/signupValidation';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VerifyOtp: React.FC = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [resending, setResending] = useState(false);

    const otpError = validateOTP(otp);
    const isValid = otpError === null;

    const handleResend = async () => {
        setResending(true);
        // TODO: call resendOtp API
        // await resendOtp();
        setResending(false);
    };

    const handleNext = () => {
        // TODO: verify OTP API call
        router.push('/auth/register/Complete');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Section */}
            <View style={styles.topContainer}>
                <Text style={styles.title}>Enter OTP</Text>

                <InputField
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    style={styles.input}
                />

                <TouchableOpacity onPress={handleResend} disabled={resending}>
                    <Text style={[styles.resendText, resending && styles.resendDisabled]}>Have not received? Resend</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 24,
    },
    topContainer: {
        marginTop: 24,
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
        marginTop: 8,
        color: theme.colors.textPrimary,
        // textAlign: 'center',
        fontWeight: "600",
    },
    resendDisabled: {
        opacity: 0.6,
    },
    bottomContainer: {
        paddingBottom: 24,
    },
    button: {
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.textPrimary,
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
    },
});

export default VerifyOtp;
