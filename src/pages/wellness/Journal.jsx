import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, BookOpen, Trash2, ArrowLeft, Search, Lock } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { journalService } from '@/services/journal.service'
import { MOODS, getMoodByScore } from '@/services/mood.service'
import { useAuth } from '@/hooks/useAuth'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'

const PROMPTS = [
  'What made you smile today?',
  'What are you grateful for right now?',
  'What challenged you today, and what did you learn?',
  'Describe your current emotional state in 3 words.',
  'What would make tomorrow better than today?',
  'What\'s one small win you had recently?',
  'What thought keeps returning to you today?',
]

function randomPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
}

export default function Journal() {
  const { userId } = useAuth()
  const [view, setView]         = useState('list')   // 'list' | 'write' | 'read'
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [active, setActive]     = useState(null)
  const [search, setSearch]     = useState('')
  const [prompt]                = useState(randomPrompt)

  // Form
  const [entryTitle,   setEntryTitle]   = useState('')
  const [entryContent, setEntryContent] = useState('')
  const [entryMood,    setEntryMood]    = useState(null)

  useEffect(() => {
    if (!userId) return
    load()
  }, [userId])

  async function load() {
    setLoading(true)
    const { data } = await journalService.getAll(userId)
    setEntries(data ?? [])
    setLoading(false)
  }

  async function handleSave() {
    if (!entryContent.trim()) {
      toast.error('Write something first.')
      return
    }
    setSaving(true)
    const { error } = await journalService.create(userId, {
      title: entryTitle.trim() || `Entry — ${format(new Date(), 'MMM d, yyyy')}`,
      content: entryContent.trim(),
      mood_score: entryMood,
    })
    if (error) {
      toast.error('Could not save entry.')
    } else {
      toast.success('Entry saved 📔')
      setEntryTitle('')
      setEntryContent('')
      setEntryMood(null)
      setView('list')
      load()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    const { error } = await journalService.delete(id)
    if (error) {
      toast.error('Could not delete entry.')
      load()
    } else {
      if (view === 'read' && active?.id === id) {
        setView('list')
        setActive(null)
      }
    }
  }

  const filtered = entries.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  )

  // ── Write view ────────────────────────────────────────────────
  if (view === 'write') {
    return (
      <PageWrapper>
        <PageContainer className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setView('list')} className="btn-ghost !px-2.5 !py-2">
              <ArrowLeft size={16} />
            </button>
            <h1 className="page-title">New Entry</h1>
          </div>

          <div className="glass-card space-y-4">
            {/* Prompt */}
            <div
              className="text-sm italic p-3 rounded-xl"
              style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent-lavender)', border: '1px solid rgba(167,139,250,0.15)' }}
            >
              💭 Prompt: {prompt}
            </div>

            <input
              type="text"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              placeholder="Title (optional)"
              className="input-zen text-base font-display"
            />

            <textarea
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              placeholder="Write freely. This is your space..."
              rows={12}
              className="input-zen resize-none leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
              autoFocus
            />

            {/* Mood */}
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                How are you feeling as you write?
              </p>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.score}
                    onClick={() => setEntryMood(entryMood === m.score ? null : m.score)}
                    className="text-xl transition-all duration-200"
                    style={{
                      opacity: entryMood && entryMood !== m.score ? 0.3 : 1,
                      transform: entryMood === m.score ? 'scale(1.3)' : 'scale(1)',
                    }}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} disabled={saving || !entryContent.trim()} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
              <button onClick={() => setView('list')} className="btn-ghost">
                Discard
              </button>
            </div>
          </div>
        </PageContainer>
      </PageWrapper>
    )
  }

  // ── Read view ────────────────────────────────────────────────
  if (view === 'read' && active) {
    const moodInfo = active.mood_score ? getMoodByScore(active.mood_score) : null
    return (
      <PageWrapper>
        <PageContainer className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-6">
            <button onClick={() => { setView('list'); setActive(null) }} className="btn-ghost !px-2.5 !py-2">
              <ArrowLeft size={16} />
            </button>
            <button onClick={() => handleDelete(active.id)} className="btn-danger !px-2.5 !py-2">
              <Trash2 size={14} />
            </button>
          </div>

          <article className="glass-card">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {active.title}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {format(new Date(active.created_at), 'EEEE, MMMM d, yyyy · h:mm a')}
                </p>
              </div>
              {moodInfo && (
                <span className="text-3xl flex-shrink-0" title={moodInfo.label}>
                  {moodInfo.emoji}
                </span>
              )}
            </div>

            <div className="divider" />

            <p
              className="mt-4 text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', lineHeight: 1.8 }}
            >
              {active.content}
            </p>

            <div className="flex items-center gap-1 mt-6" style={{ color: 'var(--text-tertiary)' }}>
              <Lock size={11} />
              <span className="text-xs">Private entry</span>
            </div>
          </article>
        </PageContainer>
      </PageWrapper>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader
          title="Journal"
          subtitle="Reflect, release, and grow"
          action={
            <button onClick={() => setView('write')} className="btn-primary">
              <Plus size={16} />
              New Entry
            </button>
          }
        />

        {entries.length > 0 && (
          <div className="relative mb-6">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries..."
              className="input-zen pl-9"
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card text-center py-16"
          >
            <BookOpen size={40} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
              {entries.length === 0 ? 'Your journal awaits' : 'No entries found'}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              {entries.length === 0
                ? 'Write your first entry. This is your safe, private space.'
                : 'Try a different search.'}
            </p>
            {entries.length === 0 && (
              <button onClick={() => setView('write')} className="btn-primary">
                Begin Writing
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((entry) => {
                const moodInfo = entry.mood_score ? getMoodByScore(entry.mood_score) : null
                return (
                  <motion.button
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { setActive(entry); setView('read') }}
                    className="glass-sm w-full text-left p-4 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {moodInfo && <span className="text-base">{moodInfo.emoji}</span>}
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {entry.title}
                          </p>
                        </div>
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {entry.content}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {format(new Date(entry.created_at), 'MMM d')}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(entry.id) }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                          style={{ color: 'var(--text-tertiary)' }}
                          aria-label="Delete entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>
    </PageWrapper>
  )
}
