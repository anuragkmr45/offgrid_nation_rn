// app/stripe/cancel.tsx

import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

export default function StripeCancel() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/root/feed')
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>❌</Text>
      <Text style={styles.title}>Payment Cancelled</Text>
      <Text style={styles.sub}>Something went wrong or was cancelled.</Text>
      <Button
        title="Try Again"
        onPress={() => {
          // just go back to the premium screen so they can retry
          router.replace('/root/premium')
        }}
      />
    </View>
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
    color:    'red',
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
