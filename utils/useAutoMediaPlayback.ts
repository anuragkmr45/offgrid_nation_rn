import { Video } from 'expo-av'
import { useEffect, useRef } from 'react'
import { isVideo } from './mediaHelpers'

export const useAutoMediaPlayback = (mediaUrl: string, isVisible: boolean) => {
  const mediaRef = useRef<Video>(null)

  useEffect(() => {
    if (!isVideo(mediaUrl)) return

    const controlPlayback = async () => {
      if (!mediaRef.current) return

      try {
        if (isVisible) {
          await mediaRef.current.playAsync()
        } else {
          await mediaRef.current.pauseAsync()
        }
      } catch (err) {
        console.warn('Auto-playback error:', err)
      }
    }

    controlPlayback()
  }, [isVisible, mediaUrl])

  return { mediaRef }
}
