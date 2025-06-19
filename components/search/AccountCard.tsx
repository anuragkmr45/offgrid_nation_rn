// components/search/AccountCard.tsx
import { theme } from '@/constants/theme'
import React, { useState } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

export interface AccountCardProps {
    avatarUrl: string
    fullName: string
    handle: string   // e.g. "@johndoe"
    isFollowing?: boolean
    onToggleFollow?: (newState: boolean) => void
}

export const AccountCard: React.FC<AccountCardProps> = ({
    avatarUrl,
    fullName,
    handle,
    isFollowing: initial = false,
    onToggleFollow,
}) => {
    const [isFollowing, setIsFollowing] = useState(initial)

    const toggle = () => {
        const next = !isFollowing
        setIsFollowing(next)
        onToggleFollow?.(next)
    }

    return (
        <View style={styles.card}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.fullName}>{fullName}</Text>
                <Text style={styles.handle}>{handle}</Text>
            </View>

            <TouchableOpacity
                onPress={toggle}
                style={[
                    styles.followButton,
                    isFollowing && styles.followingButton
                ]}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.followText,
                    isFollowing && styles.followingText
                ]}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.background,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    fullName: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.background,
    },
    handle: {
        fontSize: 14,
        color: theme.colors.background,
        opacity: 0.8,
        marginTop: 2,
    },
    followButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: theme.colors.background,
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.background,
    },
    followText: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.primary,
    },
    followingText: {
        color: theme.colors.background,
    },
})
