// components/OtpInput.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputKeyPressEventData,
    TextInputProps,
    View,
} from 'react-native';

type OtpInputProps = {
    length?: number;
    onChange?: (otp: string) => void;
    containerStyle?: object;
    boxStyle?: object;
} & Omit<TextInputProps, 'onChange'>;

export default function OtpInput({
    length = 6,
    onChange,
    containerStyle,
    boxStyle,
    ...rest
}: OtpInputProps) {
    const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
    const inputsRef = useRef<Array<TextInput | null>>([]);

    // Whenever digits change, notify parent
    useEffect(() => {
        onChange?.(digits.join(''));
    }, [digits]);

    const handleChange = (text: string, idx: number) => {
        // If user pasted full code
        if (text.length > 1) {
            const split = text.slice(0, length).split('');
            setDigits(split.concat(Array(length - split.length).fill('')));
            // focus last filled
            const last = Math.min(split.length, length - 1);
            inputsRef.current[last]?.focus();
            return;
        }

        // Single digit
        if (/^\d$/.test(text) || text === '') {
            const newDigits = [...digits];
            newDigits[idx] = text;
            setDigits(newDigits);
            if (text && idx < length - 1) {
                inputsRef.current[idx + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        idx: number
    ) => {
        if (e.nativeEvent.key === 'Backspace' && digits[idx] === '' && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {Array(length)
                .fill(0)
                .map((_, idx) => (
                    <TextInput
                        key={idx}
                        ref={ref => { inputsRef.current[idx] = ref }}
                        value={digits[idx]}
                        onChangeText={text => handleChange(text, idx)}
                        onKeyPress={e => handleKeyPress(e, idx)}
                        keyboardType="number-pad"
                        maxLength={length} // allows paste of full code
                        returnKeyType="done"
                        textContentType="oneTimeCode" // iOS autofill
                        style={[styles.box, boxStyle]}
                        selectionColor="#000"
                        {...rest}
                    />
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    box: {
        flex: 1,
        marginHorizontal: 4,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
    },
});
