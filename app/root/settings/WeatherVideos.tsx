// app/root/settings/WeatherVideos.tsx
import { theme } from '@/constants/theme'
import { youtubeService } from '@/utils/youtubeService'
import * as Linking from 'expo-linking'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

type Video = {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

export default function WeatherVideos() {
  const { channelHandle } = useLocalSearchParams<{ channelHandle: string }>()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const items = await youtubeService.getChannelVideosByUsername(channelHandle)
        setVideos(items)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [channelHandle])

  const openYouTube = async (id: string) => {
    const appUrl = `youtube://www.youtube.com/watch?v=${id}`
    const webUrl = `https://youtu.be/${id}`
    try {
      await Linking.openURL(appUrl)
    } catch {
      await Linking.openURL(webUrl)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={v => v.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => openYouTube(item.id)} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 120, height: 68, backgroundColor: '#ccc' }}>
              <Image
                source={{ uri: item.thumbnail }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 }}>
                {new Date(item.publishedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  )
}
