import { socialApi } from '@/features/social/api/socialApi'
import { store } from '@/store/store'
import Toast from 'react-native-toast-message'

/**
 * Toggle follow/unfollow behavior by calling the followUser mutation.
 *
 * The backend will decide if it becomes follow or unfollow based on current state.
 *
 * @param username Username to toggle follow
 * @param isBlocked Prevents follow if user is blocked
 * @returns `true` if now following, `false` if unfollowed or requested
 */
export async function toggleFollowUser({
    username,
    isBlocked = false,
}: {
    username: string
    isBlocked?: boolean
}): Promise<boolean> {
    if (isBlocked) {
        Toast.show({ type: 'error', text1: "This user is blocked." })
        return false
    }

    try {
        const result = await store.dispatch(
            socialApi.endpoints.followUser.initiate(username)
        ).unwrap()

        const message = result?.message || ''
        const isNowFollowing =
            message.toLowerCase().includes('followed') ||
            message.toLowerCase().includes('requested')

        return isNowFollowing
    } catch (err: any) {

        Toast.show({ type: 'error', text1: err?.data?.error || "Error" })
        return false
    }
}
