import { theme } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        router.replace('/root/feed');
      } else {
        router.replace('/auth/login/Login');
      }
    }, 1800);

    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={theme.colors.primary}
        animated
        hidden
      />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to</Text>
        <Image
          source={{ uri: 'https://res.cloudinary.com/dkwptotbs/image/upload/v1749901306/fr-bg-white_hea7pb.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Connect, Explore, and Thrive</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 260,
    height: 140,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
