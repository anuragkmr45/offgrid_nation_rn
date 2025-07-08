// components/settings/SettingsScreen.tsx

import { SearchBar } from '@/components/common'
import { theme } from '@/constants/theme'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SettingItem } from './SettingItem'

export const SettingsScreen: React.FC = () => {
  const [query, setQuery] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  const allItems = useMemo(() => [
    {
      key: 'profiles',
      icon: 'person-circle-outline' as const,
      title: 'Profiles',
      subtitle: 'Manage your connected experience and profile setups here.',
      onPress: () => { router.push('/root/profile/ProfileScreen') },
    },
    {
      key: 'privacy',
      icon: 'shield-outline' as const,
      title: 'Privacy',
      subtitle: 'Blocked accounts, Account privacy',
      onPress: () => console.log('Go to Privacy'),
    },
    {
      key: 'weather_details',
      icon: 'cloud-outline' as const,
      title: 'Weather Details',
      subtitle: 'Checkout latest weather status.',
      onPress: () => router.push('/root/settings/WeatherVideos'),
    },
    {
      key: 'notifications',
      icon: 'notifications-outline' as const,
      title: 'Notifications',
      subtitle: 'Messages, likes, following & followers',
      onPress: () => { router.push('/root/settings/Notifications') },
    },
    {
      key: 'language',
      icon: 'globe-outline' as const,
      title: 'App Language',
      subtitle: `English (device's language)`,
      onPress: () => console.log('Go to Language'),
    },
    {
      key: 'help',
      icon: 'help-circle-outline' as const,
      title: 'Help',
      subtitle: 'Help centre / contact us',
      onPress: () => { router.push('/root/settings/HelpCenterScreen') },
    },
    {
      key: 'invite',
      icon: 'people-outline' as const,
      title: 'Invite Friends',
      onPress: () => console.log('Invite Friends'),
    },
    {
      key: 'logout',
      icon: 'log-out-outline' as const,
      title: 'Log out',
      // open our confirm modal instead of immediate logout
      onPress: () => setShowLogoutModal(true),
    },
  ], [])

  const filtered = useMemo(
    () =>
      allItems.filter(i =>
        i.title.toLowerCase().includes(query.toLowerCase())
      ),
    [query, allItems]
  )

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="dark-content"
        animated
      />
      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* SEARCH */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          style={styles.searchBar}
        />

        {/* ITEMS */}
        <ScrollView contentContainerStyle={styles.list}>
          {filtered.map(item => (
            <SettingItem
              key={item.key}
              iconName={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={item.onPress}
            />
          ))}
        </ScrollView>

        {/* LOGOUT CONFIRMATION MODAL */}
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Log out?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutButton]}
                  onPress={() => {
                    setShowLogoutModal(false)
                    logout()
                    router.replace('/auth/login/Login')
                  }}
                >
                  <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textSecondary + '33',
  },
  headerTitle: {
    fontSize: theme.fontSizes.titleLarge,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  searchBar: {
    height: 60,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  list: {
    paddingBottom: 16,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
  modalMessage: {
    fontSize: theme.fontSizes.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.textSecondary + '22',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  logoutText: {
    color: theme.colors.background,
    fontWeight: '600',
  },
})
