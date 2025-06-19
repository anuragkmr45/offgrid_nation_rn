// components/common/BottomSheet.tsx

import { theme } from '@/constants/theme'
import React from 'react'
import {
    Dimensions,
    Modal as RNModal,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native'

export interface BottomSheetProps {
    visible: boolean
    onClose: () => void
    /** Height of the sheet in px or % (e.g. '60%') */
    height?: number | string
    children: React.ReactNode
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    height = '50%',
    children,
}) => {
    const { width, height: screenHeight } = Dimensions.get('window')
    const sheetHeight = typeof height === 'string'
        ? screenHeight * parseFloat(height) / 100
        : height

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* Overlay: dismiss on tap */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            {/* The sheet container */}
            <View style={[styles.sheet, { height: sheetHeight, width }]}>
                {/* Drag handle */}
                <View style={styles.handle} />

                {/* Sheet content */}
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </RNModal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: theme.colors.background,
        overflow: 'hidden',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.textSecondary,
        alignSelf: 'center',
        marginVertical: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
})
