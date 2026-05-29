import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, Moon } from 'lucide-react'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'

const SOUNDS = [
  {
    id: 'rain',
    label: 'Rain',
    emoji: '🌧️',
    desc: 'Gentle rainfall on a quiet evening',
    color: '#7c9ef5',
    // Using freely licensed audio from CDN — replace with /public/sounds/ files
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b6b1f3f98.mp3?filename=rain-and-thunder-16705.mp3',
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌲',
    desc: 'Birds and rustling leaves',
    color: '#5eead4',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
  },
  {
    id: 'ocean',
    label: 'Ocean Waves',
    emoji: '🌊',
    desc: 'Waves breaking on a calm shore',
    color: '#a78bfa',
    src: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_57ac9f3c45.mp3?filename=ocean-waves-112906.mp3',
  },
  {
    id: 'cafe',
    label: 'Café',
    emoji: '☕',
    desc: 'Warm café background chatter',
    color: '#f0b97a',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_8fa6f2c53b.mp3?filename=coffee-shop-ambience-8474.mp3',
  },
  {
    id: 'fire',
    label: 'Fireplace',
    emoji: '🔥',
    desc: 'Crackling logs in a warm fireplace',
    color: '#fb7185',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_bd9413e23b.mp3?filename=fireplace-16344.mp3',
  },
  {
    id: 'white',
    label: 'White Noise',
    emoji: '💨',
    desc: 'Steady white noise for deep focus',
    color: '#8899aa',
    src: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bde808.mp3?filename=white-noise-10min-51312.mp3',
  },
]

const TIMERS = [
  { label: 'No timer', value: 0 },
  { label: '15 min',   value: 15 * 60 },
  { label: '30 min',   value: 30 * 60 },
  { label: '45 min',   value: 45 * 60 },
  { label: '1 hour',   value: 60 * 60 },
]

export default function SleepSounds() {
  const [active,    setActive]    = useState(null)       // sound id
  const [volume,    setVolume]    = useState(0.5)
  const [muted,     setMuted]     = useState(false)
  const [timer,     setTimer]     = useState(0)          // seconds remaining
  const [timerSel,  setTimerSel]  = useState(0)          // selected duration
  const audioRef   = useRef(null)
  const timerRef   = useRef(null)

  // Handle sound switching
  useEffect(() => {
    if (!audioRef.current) return
    if (active) {
      const sound = SOUNDS.find((s) => s.id === active)
      if (!sound) return
      audioRef.current.src = sound.src
      audioRef.current.loop = true
      audioRef.current.volume = muted ? 0 : volume
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
  }, [active])

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  // Sleep timer countdown
  useEffect(() => {
    if (timerSel === 0) return
    setTimer(timerSel)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setActive(null)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerSel])

  function toggleSound(id) {
    setActive((prev) => (prev === id ? null : id))
  }

  function formatTimer(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const activeSound = SOUNDS.find((s) => s.id === active)

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader
          title="Sleep Sounds"
          subtitle="Ambient audio for rest, focus, and calm"
        />

        {/* Now playing banner */}
        <AnimatePresence>
          {activeSound && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card mb-6 flex items-center gap-4"
              style={{ borderColor: `${activeSound.color}30` }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${activeSound.color}20` }}
              >
                {activeSound.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xs mb-0.5" style={{ color: activeSound.color }}>Now playing</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {activeSound.label}
                </p>
              </div>
              {timer > 0 && (
                <div className="flex items-center gap-1.5">
                  <Moon size={13} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="font-mono-zen text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatTimer(timer)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {SOUNDS.map((sound) => {
            const isActive = active === sound.id
            return (
              <motion.button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass p-5 rounded-2xl text-left relative overflow-hidden"
                style={{
                  borderColor: isActive ? sound.color : 'var(--border-glass)',
                  boxShadow: isActive ? `0 0 20px ${sound.color}25` : 'none',
                }}
              >
                {/* Playing pulse */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: `${sound.color}08` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{sound.emoji}</span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: isActive ? sound.color : 'var(--bg-glass)',
                        border: `1px solid ${isActive ? sound.color : 'var(--border-glass)'}`,
                      }}
                    >
                      {isActive
                        ? <Pause size={10} fill="white" color="white" />
                        : <Play size={10} style={{ color: 'var(--text-tertiary)' }} />
                      }
                    </div>
                  </div>
                  <p className="text-sm font-medium" style={{ color: isActive ? sound.color : 'var(--text-primary)' }}>
                    {sound.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {sound.desc}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Controls */}
        <div className="glass-card space-y-5">
          {/* Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted((m) => !m)}
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Volume</label>
              </div>
              <span className="text-sm font-mono-zen" style={{ color: 'var(--accent-blue)' }}>
                {muted ? 'Muted' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={volume}
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
              className="w-full"
              style={{ accentColor: 'var(--accent-blue)' }}
            />
          </div>

          {/* Sleep timer */}
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <Moon size={14} className="inline mr-1.5" />
              Sleep timer
            </p>
            <div className="flex gap-2 flex-wrap">
              {TIMERS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTimerSel(t.value)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all duration-200"
                  style={{
                    background: timerSel === t.value ? 'rgba(124,158,245,0.15)' : 'var(--bg-glass)',
                    color: timerSel === t.value ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    border: `1px solid ${timerSel === t.value ? 'rgba(124,158,245,0.3)' : 'var(--border-glass)'}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} />
      </PageContainer>
    </PageWrapper>
  )
}