// utils/media.ts

export const isVideo = (url: string): boolean => {
  return url.includes('/posts/video/')
}

export const isImage = (url: string): boolean => {
  return url.includes('/posts/') && !isVideo(url)
}
