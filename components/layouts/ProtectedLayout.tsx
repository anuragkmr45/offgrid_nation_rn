import { useAppSelector } from '@/store/hooks'
import { persistor } from '@/store/store'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const user = useAppSelector((state) => state.auth.user)
    const [rehydrated, setRehydrated] = useState(persistor.getState().bootstrapped)

    useEffect(() => {
        if (!rehydrated) {
            const interval = setInterval(() => {
                const bootstrapped = persistor.getState().bootstrapped
                if (bootstrapped) {
                    setRehydrated(true)
                    clearInterval(interval)
                }
            }, 50)

            return () => clearInterval(interval)
        }
    }, [rehydrated])

    if (!rehydrated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const isAuthenticated = !!(user && user._id)

    if (!isAuthenticated) {
        return <Redirect href="/auth/login/Login" />
    }

    return <>{children}</>
}
