// components/marketplace/SectionHeader.tsx

import { theme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

export interface SectionHeaderProps {
    /** Section title text */
    title: string
    /** Optional location label */
    location?: string
    /** Optional handler when tapping the location badge */
    onLocationPress?: () => void
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    location,
    onLocationPress,
}) => (
    <View style={styles.container}>
        {/* Left: section title */}
        <Text style={styles.title}>{title}</Text>

        {/* Right: location badge */}
        {location && (
            <TouchableOpacity
                style={styles.locationBadge}
                activeOpacity={0.7}
                onPress={onLocationPress}
            >
                <Ionicons
                    name="location-outline"
                    size={16}
                    color={theme.colors.primary}
                    style={styles.locationIcon}
                />
                <Text style={styles.locationText}>{location}</Text>
            </TouchableOpacity>
        )}
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    title: {
        fontSize: theme.fontSizes.titleLarge,
        fontWeight: "600",
        color: theme.colors.textPrimary,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    locationIcon: {
        marginRight: 4,
    },
    locationText: {
        fontSize: theme.fontSizes.bodyMedium,
        color: theme.colors.primary,
    },
})
