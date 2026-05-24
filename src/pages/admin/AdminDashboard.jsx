import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Star, Trash2, Plus, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'

const TABS = [
  { id: 'overview',      icon: Shield, label: 'Overview' },
  { id: 'users',         icon: Users,  label: 'Users' },
  { id: 'affirmations',  icon: Star,   label: 'Affirmations' },
]

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [tab, setTab]                   = useState('overview')
  const [users, setUsers]               = useState([])
  const [affirmations, setAffirmations] = useState([])
  const [stats, setStats]               = useState(null)
  const [loading, setLoading]           = useState(true)

  // New affirmation form
  const [newText,   setNewText]   = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newCat,    setNewCat]    = useState('')
  const [addingAff, setAddingAff] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    await Promise.all([loadStats(), loadUsers(), loadAffirmations()])
    setLoading(false)
  }

  async function loadStats() {
    const [{ count: userCount }, { count: todoCount }, { count: moodCount }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('todos').select('*', { count: 'exact', head: true }),
      supabase.from('mood_logs').select('*', { count: 'exact', head: true }),
    ])
    setStats({ userCount, todoCount, moodCount })
  }

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, username, is_admin, onboarded, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    setUsers(data ?? [])
  }

  async function loadAffirmations() {
    const { data } = await supabase
      .from('affirmations')
      .select('*')
      .order('created_at', { ascending: false })
    setAffirmations(data ?? [])
  }

  async function toggleUserAdmin(userId, current) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !current })
      .eq('id', userId)
    if (error) {
      toast.error('Failed to update role.')
    } else {
      toast.success('User role updated.')
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_admin: !current } : u))
    }
  }

  async function addAffirmation() {
    if (!newText.trim()) { toast.error('Enter affirmation text.'); return }
    setAddingAff(true)
    const { data, error } = await supabase
      .from('affirmations')
      .insert({
        content: newText.trim(),
        author: newAuthor.trim() || null,
        category: newCat.trim() || null,
        is_active: true,
        created_by: profile?.id,
      })
      .select()
      .single()

    if (error) {
      toast.error('Could not add affirmation.')
    } else {
      toast.success('Affirmation added ✨')
      setAffirmations((prev) => [data, ...prev])
      setNewText(''); setNewAuthor(''); setNewCat('')
    }
    setAddingAff(false)
  }

  async function toggleAffirmation(id, current) {
    await supabase.from('affirmations').update({ is_active: !current }).eq('id', id)
    setAffirmations((prev) => prev.map((a) => a.id === id ? { ...a, is_active: !current } : a))
  }

  async function deleteAffirmation(id) {
    const { error } = await supabase.from('affirmations').delete().eq('id', id)
    if (!error) {
      setAffirmations((prev) => prev.filter((a) => a.id !== id))
      toast.success('Deleted.')
    }
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-4xl mx-auto">
        <PageHeader
          title="Admin Panel"
          subtitle="ZenZone V2 — Anupama Bain & Arijit Adhikary"
          action={
            <button onClick={loadAll} className="btn-ghost !px-2.5 !py-2" title="Refresh">
              <RefreshCw size={15} />
            </button>
          }
        />

        {/* Admin guard notice */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6 text-sm"
          style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.15)', color: '#fb7185' }}
        >
          <Shield size={14} />
          Restricted area — Admin access only
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200"
              style={{
                background: tab === id ? 'rgba(124,158,245,0.15)' : 'var(--bg-glass)',
                color: tab === id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: `1px solid ${tab === id ? 'rgba(124,158,245,0.3)' : 'var(--border-glass)'}`,
                fontWeight: tab === id ? 500 : 400,
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map((i) => <Skeleton key={i} className="h-28" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total users',   value: stats?.userCount ?? 0,  color: 'var(--accent-blue)' },
                  { label: 'Total tasks',   value: stats?.todoCount ?? 0,  color: 'var(--accent-teal)' },
                  { label: 'Mood entries',  value: stats?.moodCount ?? 0,  color: 'var(--accent-lavender)' },
                ].map((s) => (
                  <div key={s.label} className="glass-card text-center">
                    <p className="text-3xl font-mono-zen font-medium mb-1" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="glass-card">
              <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Platform Admins</p>
              <div className="space-y-2">
                {[
                  { name: 'Anupama Bain', role: 'Co-Admin' },
                  { name: 'Arijit Adhikary', role: 'Co-Admin' },
                ].map((a) => (
                  <div key={a.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))', color: '#fff' }}
                      >
                        {a.name.charAt(0)}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</span>
                    </div>
                    <span className="badge badge-blue">{a.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="glass-sm flex items-center gap-3 p-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                      style={{ background: 'rgba(124,158,245,0.2)', color: 'var(--accent-blue)' }}
                    >
                      {u.display_name?.charAt(0) ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {u.display_name ?? 'Anonymous'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Joined {format(new Date(u.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.is_admin && <span className="badge badge-blue">Admin</span>}
                      {u.onboarded && <span className="badge badge-green">Active</span>}
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    No users yet.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Affirmations ── */}
        {tab === 'affirmations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Add form */}
            <div className="glass-card mb-6">
              <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Add Affirmation</p>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter affirmation text..."
                rows={3}
                className="input-zen resize-none mb-3"
              />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Author (optional)"
                  className="input-zen text-sm"
                />
                <input
                  type="text"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="Category (optional)"
                  className="input-zen text-sm"
                />
              </div>
              <button onClick={addAffirmation} disabled={addingAff || !newText.trim()} className="btn-primary">
                <Plus size={15} />
                {addingAff ? 'Adding...' : 'Add Affirmation'}
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {affirmations.map((aff) => (
                <div
                  key={aff.id}
                  className="glass-sm flex items-start gap-3 p-4"
                  style={{ opacity: aff.is_active ? 1 : 0.5 }}
                >
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>"{aff.content}"</p>
                    {aff.author && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>— {aff.author}</p>
                    )}
                    {aff.category && (
                      <span className="badge badge-blue mt-1 text-xs">{aff.category}</span>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleAffirmation(aff.id, aff.is_active)}
                      className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: aff.is_active ? 'rgba(94,234,212,0.1)' : 'rgba(124,158,245,0.1)',
                        color: aff.is_active ? 'var(--accent-teal)' : 'var(--accent-blue)',
                        border: `1px solid ${aff.is_active ? 'rgba(94,234,212,0.2)' : 'rgba(124,158,245,0.2)'}`,
                      }}
                    >
                      {aff.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteAffirmation(aff.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'var(--text-tertiary)' }}
                      aria-label="Delete affirmation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {affirmations.length === 0 && !loading && (
                <p className="text-center py-8 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  No affirmations yet. Add your first one above.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </PageContainer>
    </PageWrapper>
  )
}
