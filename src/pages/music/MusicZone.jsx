import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ExternalLink, Music, Search } from 'lucide-react'
import { CURATED_PLAYLISTS, searchYouTube, buildEmbedUrl } from '@/lib/youtube'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'

export default function MusicZone() {
  const [activePlaylist, setActivePlaylist] = useState(null)
  const [searchQuery, setSearchQuery]       = useState('')
  const [searchResults, setSearchResults]   = useState([])
  const [searching, setSearching]           = useState(false)
  const [activeVideo, setActiveVideo]       = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    setActivePlaylist(null)
    const data = await searchYouTube(`${searchQuery} meditation relaxation`, 8)
    setSearchResults(data.items ?? [])
    setSearching(false)
  }

  function playVideo(videoId) {
    setActiveVideo(videoId)
    setActivePlaylist(null)
  }

  function openPlaylist(playlistId) {
    setActivePlaylist(playlistId)
    setActiveVideo(null)
    setSearchResults([])
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-3xl mx-auto">
        <PageHeader
          title="Music Zone"
          subtitle="Curated sounds for focus, meditation, and rest"
        />

        {/* Curated playlists */}
        <div>
          <p className="section-title mb-4">Curated Playlists</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {CURATED_PLAYLISTS.map((pl) => (
              <motion.button
                key={pl.id}
                onClick={() => openPlaylist(pl.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass text-left p-4 rounded-2xl"
                style={{
                  borderColor: activePlaylist === pl.id ? pl.color : 'var(--border-glass)',
                  boxShadow: activePlaylist === pl.id ? `0 0 20px ${pl.color}30` : 'none',
                }}
              >
                <div
                  className="text-3xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${pl.color}20`, border: `1px solid ${pl.color}30` }}
                >
                  {pl.emoji}
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {pl.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {pl.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* YouTube search */}
        <div className="mb-6">
          <p className="section-title mb-4">Search</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. rain sounds, lo-fi study, forest ambience"
                className="input-zen pl-9"
              />
            </div>
            <button type="submit" disabled={searching} className="btn-primary !px-5">
              {searching ? '...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Active playlist embed */}
        <AnimatePresence>
          {activePlaylist && (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <div className="glass rounded-3xl overflow-hidden">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${activePlaylist}&autoplay=1&modestbranding=1&rel=0`}
                  title="Wellness Playlist"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                  style={{ height: 360, border: 'none' }}
                />
              </div>
            </motion.div>
          )}

          {/* Single video embed */}
          {activeVideo && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <div className="glass rounded-3xl overflow-hidden">
                <iframe
                  src={buildEmbedUrl(activeVideo, { autoplay: 1 })}
                  title="Video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                  style={{ height: 360, border: 'none' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="section-title mb-4">Results</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {searchResults.map((item) => {
                const videoId = item.id?.videoId
                if (!videoId) return null
                return (
                  <motion.button
                    key={videoId}
                    onClick={() => playVideo(videoId)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="glass rounded-2xl overflow-hidden text-left"
                  >
                    <div className="relative">
                      <img
                        src={item.snippet?.thumbnails?.medium?.url}
                        alt={item.snippet?.title}
                        className="w-full object-cover"
                        style={{ height: 90 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <Play size={24} fill="white" color="white" />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium line-clamp-2 leading-snug"
                        style={{ color: 'var(--text-primary)' }}>
                        {item.snippet?.title}
                      </p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                        {item.snippet?.channelTitle}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!activePlaylist && !activeVideo && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            className="glass-card text-center py-12"
          >
            <Music size={36} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <p className="font-display text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
              Choose a playlist or search above
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Let music set the tone for your session
            </p>
          </motion.div>
        )}
      </PageContainer>
    </PageWrapper>
  )
}
