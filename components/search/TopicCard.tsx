// components/search/TopicCard.tsx
import { theme } from '@/constants/theme'
import React from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'

export interface TopicCardProps {
    imageUrl: string
    title: string
    onPress?: () => void
}

export const TopicCard: React.FC<TopicCardProps> = ({
    imageUrl,
    title,
    onPress,
}) => (
    <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    card: {
        width: 120,
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: theme.colors.background,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 80,
        backgroundColor: theme.colors.textSecondary,
    },
    title: {
        marginTop: 8,
        marginBottom: 12,
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
})
