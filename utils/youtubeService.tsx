// services/youtubeService.ts
import Constants from 'expo-constants'

const API_KEY = Constants.manifest?.extra?.YOUTUBE_API_KEY
const BASE = 'https://www.googleapis.com/youtube/v3'

export const youtubeService = {
  // 1) resolve handle → channelId
  async getChannelId(username: string): Promise<string> {
    const res = await fetch(
      `${BASE}/channels?part=id&forUsername=${username}&key=${API_KEY}`
    )
    const json = await res.json()
    if (!json.items?.length) throw new Error('Channel not found')
    return json.items[0].id
  },

  // 2) fetch latest videos via search endpoint
  async getChannelVideosByUsername(username: string) {
    const channelId = await this.getChannelId(username)
    const res = await fetch(
      `${BASE}/search?channelId=${channelId}&part=snippet&order=date&maxResults=50&key=${API_KEY}`
    )
    const json = await res.json()
    return json.items.map((it: any) => ({
      id: it.id.videoId,
      title: it.snippet.title,
      thumbnail: it.snippet.thumbnails.medium.url,
      publishedAt: it.snippet.publishedAt,
    }))
  },
}
