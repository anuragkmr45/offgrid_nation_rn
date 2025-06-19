// components/search/SearchTabs.tsx
import { theme } from '@/constants/theme'
import React, { useEffect, useRef } from 'react'
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TAB_WIDTH = (SCREEN_WIDTH - 32) / 2  // container has 16px side padding

export interface SearchTabsProps {
    options: string[]            // e.g. ['Accounts','Topics']
    selectedIndex: number
    onSelect: (i: number) => void
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
    options,
    selectedIndex,
    onSelect,
}) => {
    const translateX = useRef(new Animated.Value(selectedIndex * TAB_WIDTH)).current

    // Animate underline
    useEffect(() => {
        Animated.spring(translateX, {
            toValue: selectedIndex * TAB_WIDTH,
            useNativeDriver: true,
        }).start()
    }, [selectedIndex])

    return (
        <View style={styles.tabsContainer}>
            {options.map((opt, i) => (
                <TouchableOpacity
                    key={opt}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                    onPress={() => onSelect(i)}
                >
                    <Text style={[
                        styles.tabText,
                        i === selectedIndex && styles.tabTextActive
                    ]}>
                        {opt}
                    </Text>
                </TouchableOpacity>
            ))}

            <Animated.View
                style={[
                    styles.underline,
                    { transform: [{ translateX }] }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        position: 'relative',
    },
    tabButton: {
        width: TAB_WIDTH,
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabText: {
        fontSize: 16,
        color: theme.colors.background,
        fontWeight: "500",
    },
    tabTextActive: {
        fontWeight: "500",
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: TAB_WIDTH,
        height: 2,
        backgroundColor: theme.colors.background,
        borderRadius: 1,
    },
})
