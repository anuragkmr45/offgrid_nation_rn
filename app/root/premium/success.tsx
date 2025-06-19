// app/stripe/success.tsx

import { useRouter } from 'expo-router'
import React from 'react'
import { Button, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StripeSuccess() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.sub}>You’ve unlocked premium access 🎉</Text>
      <Button
        title="Continue"
        onPress={() => {
          // replace the current screen with your premium feed
          router.replace('/root/premium')
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         16,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize:      24,
    fontWeight:    'bold',
    marginTop:     20,
  },
  sub: {
    textAlign:     'center',
    marginVertical:10,
  },
})
