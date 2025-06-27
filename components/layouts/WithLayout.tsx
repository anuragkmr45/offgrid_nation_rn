import { theme } from '@/constants/theme'
import { TAB_EVENTS, TabEventEmitter } from '@/utils/TabEventEmitter'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Link, usePathname, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import {
  Dimensions,
  Image,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

// Icon‐name unions
type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name']

export interface WithLayoutProps {
  children: React.ReactNode
  /** StatusBar text + icon color */
  statusBarStyle?: StatusBarStyle
  /** StatusBar background (Android) */
  statusBarBgColor?: string
  /** Top header background color */
  headerBgColor?: string
}

export const WithLayout: React.FC<WithLayoutProps> = ({
  children,
  statusBarStyle = 'dark-content',
  statusBarBgColor = theme.colors.background,
  headerBgColor = theme.colors.background,
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const { width } = Dimensions.get('window')
  const lastTapMap: Record<string, number> = {}

  interface NavItem {
    Component: typeof Ionicons | typeof MaterialCommunityIcons
    name: IoniconName | MCIName
    activeName?: IoniconName | MCIName
    route: string
    label: string
  }

  // Periodic toast to remind about weather videos
  useEffect(() => {
    const interval = setInterval(() => {
      Toast.show({
        type: 'info',
        text1: 'For Weather reports tap',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        onPress: () => {
          router.push('/root/settings/WeatherVideos')
        },
      })
    }, 60000) // every 60 seconds

    return () => clearInterval(interval)
  }, [router])

  // Bottom‐nav definitions
  const navItems: NavItem[] = [
    {
      Component: Ionicons,
      name: 'home-outline',
      activeName: 'home',
      route: '/root/feed',
      label: 'Home',
    },
    {
      Component: Ionicons,
      name: 'search-outline',
      activeName: 'search',
      route: '/root/search',
      label: 'Search',
    },
    {
      Component: Ionicons,
      name: 'add-circle-outline',
      activeName: 'add-circle',
      route: '/root/add-post',
      label: 'Add',
    },
    {
      Component: Ionicons,
      name: 'chatbubble-outline',
      activeName: 'chatbubble',
      route: '/root/chat',
      label: 'Messages',
    },
    {
      Component: MaterialCommunityIcons,
      name: 'crown-outline',
      activeName: 'crown',
      route: '/root/premium',
      label: 'Premium',
    },
  ]

  return (
    <>
      {/* Configurable StatusBar */}
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBgColor}
        animated
      />

      <SafeAreaView style={[styles.container, { backgroundColor: statusBarBgColor }]}>  
        {/* ===== TOP HEADER ===== */}
        <View style={[styles.topBar, { backgroundColor: headerBgColor }]}>  
          <Image
            source={{ uri: "https://res.cloudinary.com/dkwptotbs/image/upload/v1749901385/fr-bg-black_rwqtim.png" }}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.topBarIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/root/marketplace')}>
              <MaterialCommunityIcons
                name="storefront-outline"
                size={24}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/root/settings')}>
              <Ionicons
                name="menu"
                size={24}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== MAIN CONTENT ===== */}
        <View style={styles.content}>
          {children}
        </View>

        {/* ===== BOTTOM “GLASS” NAV BAR ===== */}
        <BlurView
          intensity={80}
          tint="dark"
          style={[
            styles.bottomNav,
            {
              width: 306,
              left: (width - 306) / 2,
            },
          ]}
        >
          <View style={styles.bottomNavContent}>
            {navItems.map(({ Component, name, activeName, route, label }) => {
              const isActive = pathname === route
              const iconName = (isActive && activeName) ? activeName : name
              const color = isActive
                ? theme.colors.background
                : theme.colors.textSecondary

              return (
                <Link key={route} href={route} asChild>
                  <TouchableOpacity
                    accessibilityLabel={label}
                    style={styles.navButton}
                    onPress={() => {
                      const now = Date.now()
                      const dt = now - (lastTapMap[route] || 0)
                      lastTapMap[route] = now

                      if (dt < 300) {
                        if (route === '/root/feed') {
                          TabEventEmitter.emit(TAB_EVENTS.HOME_DOUBLE_TAP)
                        } else if (route === '/root/premium') {
                          TabEventEmitter.emit(TAB_EVENTS.PREMIUM_DOUBLE_TAP)
                        } else {
                          router.push(route)
                        }
                      } else {
                        router.push(route)
                      }
                    }}
                  >
                    <Component
                      name={iconName as any}
                      size={24}
                      color={color}
                    />
                  </TouchableOpacity>
                </Link>

              )
            })}
          </View>
        </BlurView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Top header
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textSecondary,
  },
  logo: {
    width: 120,
    height: 120,
  },
  topBarIcons: {
    flexDirection: 'row',
  },

  iconButton: {
    padding: 8,
    marginLeft: 12,
  },

  // Main content
  content: {
    flex: 1,
  },

  // Bottom “glass” nav bar
  bottomNav: {
    position: 'absolute',
    bottom: 16,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.33)',
    overflow: 'hidden',
  },
  bottomNavContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // Individual nav button hit area
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
