// components/search/AccountCard.tsx
import { FollowUnfollow } from "@/components/common/FollowUnfollow";
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface AccountCardProps {
    avatarUrl: string
    fullName: string
    handle: string
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
    const router = useRouter()
    const username = handle.startsWith('@') ? handle.slice(1) : handle;

    return (
        <View style={styles.card}>
            <View style={styles.leftSection}>
                <TouchableOpacity
                    onPress={() => router.push(`/root/profile/${username}`)}
                    style={styles.profileInfo}
                >
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <View style={styles.textContainer}>
                        <Text style={styles.fullName}>{fullName}</Text>
                        <Text style={styles.handle}>{handle}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <FollowUnfollow handle={username} isFollowing={initial} />
        </View>
    )
}

const styles = StyleSheet.create({
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },

    textContainer: {
        marginLeft: 12,
        flexShrink: 1,
    },

    followButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: theme.colors.background,
        marginLeft: 8,
    },

    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.background,
    },

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
    followText: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.primary,
    },
    followingText: {
        color: theme.colors.background,
    },
})
