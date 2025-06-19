// src/utils/timeAgo.ts

/**
 * Returns a human-friendly “time ago” string for an ISO timestamp.
 * 
 * @param iso — an ISO-8601 date string
 * @returns e.g. “Just now”, “5m ago”, “3h ago”, or locale date for older items
 */
export function timeAgo(iso: string): string {
  const delta = (Date.now() - new Date(iso).getTime()) / 1000  

  if (delta < 60) {
    return 'Just now'
  } else if (delta < 3600) {
    const minutes = Math.floor(delta / 60)
    return `${minutes}m ago`
  } else if (delta < 86400) {
    const hours = Math.floor(delta / 3600)
    return `${hours}h ago`
  } else {
    return new Date(iso).toLocaleDateString()
  }
}
