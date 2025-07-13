import { Button } from '@/components/common'
import Header from '@/components/common/Header'
import OtpInput from '@/components/common/OtpInput '
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { debounce } from '@/utils/debounce'
import { validateOTP } from '@/utils/validation/signupValidation'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const VerifyOtp: React.FC = () => {
    const router = useRouter()
    const { username, mobile } = useLocalSearchParams<{
        username: string
        mobile: string
    }>()
    const [otp, setOtp] = useState('')
    const [resending, setResending] = useState(false)
    const { verifyRegistration, register } = useAuth()

    const otpError = validateOTP(otp)
    const isValid = otpError === null

    const handleResend = async () => {
        setResending(true)
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
            setResending(false)
        }
    }

    const handleNext = async () => {
        setResending(true)
        const trimmedOTP = otp.trim()
        if (trimmedOTP.length === 0) {
            Toast.show({ type: 'error', text1: 'OTP should not be empty' })
            setResending(false)
            return
        }

        try {
            const res = await verifyRegistration({ mobile, otp: trimmedOTP })
            Toast.show({ type: 'success', text1: res.message })
            setTimeout(() => {
                router.push({
                    pathname: '/auth/register/Complete',
                    params: { username, mobile },
                })
            }, 1500)
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'OTP verify fails.'
            Toast.show({ type: 'error', text1: errorMessage })
        } finally {
            setResending(false)
        }
    }

    const debouncedHandleResend = useMemo(
        () => debounce(handleResend, 1000),
        [handleResend]
    )
    useEffect(() => () => debouncedHandleResend.cancel(), [debouncedHandleResend])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={theme.colors.primary}
                animated
                barStyle="light-content"
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.flex}>
                        <Header
                            onBack={() => router.back()}
                            title="Enter OTP"
                            backgroundColor={theme.colors.primary}
                            titleColor={theme.colors.background}
                            showShadow
                            iconColor={theme.colors.background}
                        />

                        {/* Top Section */}
                        <View style={styles.topContainer}>
                            {/* <InputField
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="Enter OTP"
                                keyboardType="number-pad"
                                style={styles.input}
                            /> */}
                            <OtpInput
                                length={6}
                                onChange={setOtp}
                                containerStyle={styles.input}
                                boxStyle={{ borderColor: theme.colors.background }}
                            />
                            <View style={styles.resendRow}>
                                <Text
                                    style={[
                                        styles.resendText,
                                        resending && styles.resendDisabled,
                                    ]}
                                >
                                    Haven’t received?
                                </Text>
                                <TouchableOpacity
                                    disabled={resending}
                                    onPress={handleResend}
                                    style={styles.resendButton}
                                >
                                    <Text style={styles.resendLink}>Resend OTP</Text>
                                </TouchableOpacity>
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
                                    <Text
                                        style={styles.signInLink}
                                        onPress={() => router.push('/auth/login/Login')}
                                    >
                                        Sign In
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    flex: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topContainer: {
        paddingHorizontal: 24,
    },
    input: {
        borderRadius: 10,
        height: 50,
        marginVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 0,
    },
    resendRow: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    resendText: {
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },
    resendDisabled: {
        opacity: 0.6,
    },
    resendButton: {
        marginLeft: 6,
    },
    resendLink: {
        color: theme.colors.background,
        fontWeight: '700',
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
        fontWeight: '600',
        color: theme.colors.background,
    },
})

export default VerifyOtp
