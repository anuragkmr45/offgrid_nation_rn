// screens/PrivateAccount.tsx

import { SearchBar } from '@/components/common'
import { BottomSheet } from '@/components/common/BottomSheet'
import Header from '@/components/common/Header'
import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { APP_LOGO_WHITE, AVATAR_FALLBACK } from '@/constants/AppConstants'
import { theme } from '@/constants/theme'
import { useSearchUsers } from '@/features/list/hooks/useList'
import { useSocial } from '@/features/social/hooks/useSocial'
import { useAppSelector } from '@/store/hooks'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

// --- Minimal type for blocked user rows
type BlockedUser = {
    _id: string
    username: string
    fullName: string
    profilePicture?: string
}

export default function PrivateAccount() {
    const router = useRouter()
    const token = useAppSelector(s => s.auth?.accessToken ?? s.auth?.accessToken)

    // Local state for "GET /user/blocked" (fetched via fetch)
    const [blocked, setBlocked] = useState<BlockedUser[]>([])
    const [isBlockedLoading, setBlockedLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)

    // Bottom sheet + search & block
    const [isSheetOpen, setSheetOpen] = useState(false)
    const [query, setQuery] = useState('')
    const { users, isLoading: isSearching } = useSearchUsers(query)
    const { blockUser, isBlockLoading } = useSocial()
    const [pendingUsername, setPendingUsername] = useState<string | null>(null)

    const endpoint = 'https://apiv2.theoffgridnation.com/user/blocked'

    const fetchBlocked = useCallback(async (signal?: AbortSignal) => {
        if (!token) return
        setBlockedLoading(true)
        try {
            const res = await fetch(endpoint, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                signal,
            })
            if (!res.ok) {
                const text = await res.text().catch(() => '')
                throw new Error(text || `Request failed with ${res.status}`)
            }
            
            const json = await res.json()
            
            const list: BlockedUser[] = Array.isArray(json) ? json : json?.blockedUsers ?? []
            setBlocked(list)
        } catch (e: any) {
            if (e?.name !== 'AbortError') {
                Toast.show({ type: 'error', text1: 'Failed to load blocked users' })
            }
        } finally {
            setBlockedLoading(false)
            setRefreshing(false)
        }
    }, [token])

    // first load + refetch when token available
    useEffect(() => {
        if (!token) return
        const ctrl = new AbortController()
        fetchBlocked(ctrl.signal)
        return () => ctrl.abort()
    }, [token, fetchBlocked])

    const onRefresh = useCallback(() => {
        if (!token) return
        setRefreshing(true)
        fetchBlocked()
    }, [token, fetchBlocked])

    const onOpenSheet = () => setSheetOpen(true)
    const onCloseSheet = () => setSheetOpen(false)

    const handleBlock = useCallback(async (username: string) => {
        try {
            setPendingUsername(username)
            await blockUser(username).unwrap()
            Toast.show({ type: 'success', text1: 'User blocked', text2: `@${username} will no longer interact with you.` })
            setQuery('')
            onCloseSheet()
            fetchBlocked()
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Failed to block', text2: e?.data?.message || 'Please try again' })
        } finally {
            setPendingUsername(null)
        }
    }, [blockUser, fetchBlocked])

    const showEmpty = useMemo(() => !isBlockedLoading && blocked.length === 0, [isBlockedLoading, blocked])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" animated />
            <ProtectedLayout>
                <Header
                    onBack={() => router.back()}
                    backgroundColor={theme.colors.primary}
                    title="Blocked accounts"
                    showShadow
                    titleColor={theme.colors.background}
                    iconColor={theme.colors.background}
                />

                <TouchableOpacity onPress={onOpenSheet} style={styles.addWrap}>
                    <Text style={styles.addText}>Block User</Text>
                    <AntDesign name="pluscircleo" size={20} color="#fff" />
                </TouchableOpacity>

                {isBlockedLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.background} />
                    </View>
                ) : showEmpty ? (
                    <View style={styles.empty}>
                        <AntDesign name="lock" size={36} color="#fff" />
                        <Text style={styles.emptyTitle}>No blocked accounts</Text>
                        <Text style={styles.emptySub}>Tap “Block User” to add someone.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={blocked}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{ paddingVertical: 8 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.background}
                                colors={[theme.colors.background]}
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Image source={{ uri: item.profilePicture || AVATAR_FALLBACK }} style={styles.avatar} />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.fullName} numberOfLines={1}>{item.fullName}</Text>
                                    <Text style={styles.username} numberOfLines={1}>@{item.username}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {handleBlock(item.username)}} style={styles.unblockPill}>
                                    <Text style={styles.unblockPillText}>Unblock</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                <BottomSheet visible={isSheetOpen} onClose={onCloseSheet} height="60%">
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Block a user</Text>
                    </View>

                    <SearchBar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search by name or @username"
                        style={styles.searchBar}
                    />

                    {query.length === 0 ? (
                        <View style={[styles.center, { paddingTop: 24 }]}>
                            <Text style={styles.hint}>Start typing to find people to block</Text>
                        </View>
                    ) : isSearching ? (
                        <View style={[styles.center, { paddingTop: 24 }]}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={users}
                            keyExtractor={(u) => u._id}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => {
                                const isRowLoading = isBlockLoading && pendingUsername === item.username
                                return (
                                    <View style={styles.sheetRow}>
                                        <Image source={{ uri: item.profilePicture || APP_LOGO_WHITE }} style={styles.sheetAvatar} />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <Text style={styles.sheetName} numberOfLines={1}>{item.fullName}</Text>
                                            <Text style={styles.sheetHandle} numberOfLines={1}>@{item.username}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.blockBtn}
                                            onPress={() => handleBlock(item.username)}
                                            disabled={isRowLoading}
                                            activeOpacity={0.85}
                                        >
                                            {isRowLoading ? (
                                                <ActivityIndicator size="small" color={theme.colors.primary} />
                                            ) : (
                                                <Text style={styles.blockBtnText}>Block</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            ListEmptyComponent={
                                <View style={[styles.center, { paddingTop: 24 }]}>
                                    <Text style={styles.hint}>No users found</Text>
                                </View>
                            }
                        />
                    )}
                </BottomSheet>
            </ProtectedLayout>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    addWrap: { marginTop: 8, marginHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
    addText: { color: '#fff', fontWeight: '700', marginRight: 6 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: { alignItems: 'center', marginTop: 32, gap: 8 },
    emptyTitle: { color: '#fff', fontWeight: '700', marginTop: 4 },
    emptySub: { color: '#fff', opacity: 0.9 },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff22' },
    fullName: { color: '#fff', fontWeight: '700', fontSize: 15 },
    username: { color: '#e6f0ff', marginTop: 2 },
    unblockPill: { paddingHorizontal: 14, height: 32, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
    unblockPillText: { color: theme.colors.primary, fontWeight: '700', fontSize: 12 },

    // Sheet
    sheetHeader: { paddingTop: 4, paddingBottom: 8 },
    sheetTitle: { fontWeight: '700', fontSize: 16, color: theme.colors.textPrimary },
    searchBar: { borderRadius: 12, marginBottom: 10, borderWidth:1, borderColor: 'gray' },

    sheetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    sheetAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' },
    sheetName: { fontWeight: '700', color: theme.colors.textPrimary },
    sheetHandle: { color: theme.colors.textSecondary, marginTop: 2 },
    blockBtn: { height: 30, borderRadius: 16, paddingHorizontal: 14, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
    blockBtnText: { color: theme.colors.primary, fontWeight: '700', fontSize: 12 },

    hint: { color: theme.colors.textSecondary },
})
