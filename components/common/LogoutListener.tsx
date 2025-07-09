// src/components/LogoutListener.tsx
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export function LogoutListener() {
  const user = useAppSelector((state) => state.auth.user)
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const router = useRouter()

  useEffect(() => {
    if (!user && !accessToken) {
      router.replace('/auth/login/Login')
    }
  }, [user, accessToken])

  return null
}
