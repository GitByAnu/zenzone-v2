const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YT_BASE = 'https://www.googleapis.com/youtube/v3'

/**
 * Search YouTube for wellness/meditation playlists or videos.
 * @param {string} query - Search query
 * @param {number} maxResults - Max results (default 12)
 * @param {'video'|'playlist'} type
 */
export async function searchYouTube(query, maxResults = 12, type = 'video') {
  if (!YT_API_KEY) {
    console.warn('YouTube API key not configured. Add VITE_YOUTUBE_API_KEY to .env.local')
    return { items: [] }
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type,
    maxResults,
    key: YT_API_KEY,
    relevanceLanguage: 'en',
    safeSearch: 'strict',
  })

  try {
    const res = await fetch(`${YT_BASE}/search?${params}`)
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('YouTube search failed:', err)
    return { items: [] }
  }
}

/**
 * Curated wellness playlists — works without API key as fallback.
 * These are hand-picked, stable playlist IDs.
 */
export const CURATED_PLAYLISTS = [
  {
    id: 'PLQkQfzsIUwRbjSMF91bRCNzk98sCBRDvV',
    title: 'Deep Focus',
    description: 'Lo-fi beats for concentration',
    emoji: '🎧',
    color: 'var(--accent-blue)',
  },
  {
    id: 'PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF',
    title: 'Meditation & Calm',
    description: 'Ambient sounds for mindfulness',
    emoji: '🧘',
    color: 'var(--accent-lavender)',
  },
  {
    id: 'PLgzTt0k8mXzEk586ze4BjKoZwX4JBBdTa',
    title: 'Nature Sounds',
    description: 'Rain, forest, ocean waves',
    emoji: '🌿',
    color: 'var(--accent-teal)',
  },
  {
    id: 'PLv9ER-hkHkNFWqIJD1ED1xWaVlI9IQZZB',
    title: 'Sleep Music',
    description: 'Gentle music for deep rest',
    emoji: '🌙',
    color: 'var(--accent-amber)',
  },
]

/**
 * Build a YouTube embed URL with autoplay and privacy-enhanced mode.
 */
export function buildEmbedUrl(videoId, options = {}) {
  const { autoplay = 0, loop = 0, listId = '' } = options
  const params = new URLSearchParams({
    autoplay,
    loop,
    modestbranding: 1,
    rel: 0,
    ...(listId && { list: listId }),
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`
}
