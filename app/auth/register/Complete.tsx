import { Button } from '@/components/common';
import { theme } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validateConfirmPassword, validatePassword } from '@/utils/validation/signupValidation';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const Complete: React.FC = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { completeRegistrationFlow } = useAuth();
    const { mobile } = useLocalSearchParams<{ mobile: string }>()
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(confirm, password);
    const isValid = passwordError === null && confirmError === null;

    const handleNext = async () => {
        const trimedPassword = password.trim();

        try {
            await completeRegistrationFlow({ mobile, password: trimedPassword });
            Toast.show({
                type: "success",
                text1: "Reg complete"
            })
            setTimeout(() => {
                router.push({ pathname: '/auth/login/Login', params: { mobile, password } });
            }, 1500);
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Registration fails.';
            Toast.show({
                type: "error",
                text1: errorMessage
            })
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topContainer}>
                    <Text style={styles.title}>Create an Account</Text>

                    {/* Password Field */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a Password"
                            placeholderTextColor={theme.colors.textSecondary}
                            secureTextEntry={!showPass}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPass(v => !v)}
                        >
                            <Ionicons
                                name={showPass ? 'eye' : 'eye-off'}
                                size={24}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Field */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={confirm}
                            onChangeText={setConfirm}
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.colors.textSecondary}
                            secureTextEntry={!showConfirm}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowConfirm(v => !v)}
                        >
                            <Ionicons
                                name={showConfirm ? 'eye' : 'eye-off'}
                                size={24}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    safeArea: { flex: 1 },
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
    inputWrapper: {
        position: 'relative',
        marginVertical: 8,
    },
    input: {
        backgroundColor: theme.colors.textPrimary,
        borderRadius: 25,
        height: 50,
        paddingHorizontal: 16,
        paddingRight: 48,
        color: theme.colors.background,
    },
    eyeButton: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -12 }],
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

export default Complete;
