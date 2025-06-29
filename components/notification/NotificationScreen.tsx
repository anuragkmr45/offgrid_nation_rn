import { theme } from '@/constants/theme'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text
} from 'react-native'
import Header from '../common/Header'
import { NotificationItem } from './NotificationItem'

export const NotificationScreen: React.FC = () => {
    const router = useRouter()
    const {
        notificationsData,
        refetchNotifications,
        markNotificationsAsRead,
        isLoadingNotifications,
        isFetchingNotifications,
    } = useNotifications()

    const [refreshing, setRefreshing] = useState(false)

    // 👇 Call once on mount
    useEffect(() => {
        if (notificationsData?.items?.length) {
            const unreadIds = notificationsData.items
                .filter(n => !n.read)
                .map(n => n._id)
            if (unreadIds.length) {
                markNotificationsAsRead(unreadIds)
            }
        }
    }, [notificationsData])

    const grouped = useMemo(() => {
        const now = Date.now()
        const last24h = []
        const older = []

        for (const n of notificationsData?.items || []) {
            const age = now - new Date(n.createdAt).getTime()
            if (age < 24 * 60 * 60 * 1000) {
                last24h.push(n)
            } else {
                older.push(n)
            }
        }

        const sections = []
        if (last24h.length) sections.push({ title: 'Last 24 Hours', data: last24h })
        if (older.length) sections.push({ title: 'Earlier', data: older })
        return sections
    }, [notificationsData])

    const onRefresh = async () => {
        setRefreshing(true)
        await refetchNotifications()
        setRefreshing(false)
    }

    if (isLoadingNotifications && !notificationsData) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
                <Text style={styles.loadingText}>Loading notifications...</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBack={() => router.back()}
                backgroundColor={theme.colors.primary}
                title="Notifications"
                iconColor={theme.colors.background}
            />

            {notificationsData?.items?.length === 0 ? (
                <Text style={styles.emptyText}>You have no notifications yet.</Text>
            ) : (
                <FlatList
                    data={grouped.flatMap(g => [{ header: g.title }, ...g.data])}
                    keyExtractor={(item: any) => item._id || `header-${item.header}`}
                    renderItem={({ item }: { item: any }) =>
                        item.header ? (
                            <Text style={styles.section}>{item.header}</Text>
                        ) : (
                            <NotificationItem entity={item} />
                        )
                    }
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || isFetchingNotifications}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.accent}
                        />
                    }
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.primary },
    list: { paddingVertical: 8 },
    section: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingTop: 16,
        color: theme.colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
    loadingText: {
        marginTop: 12,
        color: theme.colors.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 100,
        color: theme.colors.background,
        fontSize: 16,
        fontWeight: '500',
    },

})
