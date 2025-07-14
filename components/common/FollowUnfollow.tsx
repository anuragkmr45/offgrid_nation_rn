// components/search/AccountCard.tsx
import { theme } from '@/constants/theme'
import { useSocial } from '@/features/social/hooks/useSocial'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle
} from 'react-native'
import Toast from 'react-native-toast-message'

export interface FollowUnfollowProps {
    handle: string
    isFollowing?: boolean
    buttonStyle?: StyleProp<ViewStyle>
}

export const FollowUnfollowButton: React.FC<FollowUnfollowProps> = ({
    isFollowing: initial, handle, buttonStyle
}) => {
    const [isFollowing, setIsFollowing] = useState(initial)
    const { followUser, isFollowLoading } = useSocial()

    const toggleFollow = async () => {
        const nextState = !isFollowing
        setIsFollowing(nextState)
        try {
            await followUser(handle).unwrap()
            Toast.show({ type: "success", text1: `Follow/Unfollow ${handle} succefully` })
        } catch (err: any) {
            const error = err?.data?.message || `Error while toggle follow`
            setIsFollowing(!nextState)
            Toast.show({ type: "error", text1: error })
        }
    }

    return (
        <TouchableOpacity
            onPress={toggleFollow}
            style={[
                styles.followButton,
                isFollowing && styles.followingButton,
                buttonStyle
            ]}
            activeOpacity={0.7}
        >
            {isFollowLoading ? <ActivityIndicator color={theme.colors.background} /> : <Text style={[
                styles.followText,
                isFollowing && styles.followingText
            ]}>
                {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>}
        </TouchableOpacity>
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
