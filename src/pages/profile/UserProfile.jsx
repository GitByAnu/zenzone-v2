import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Moon, Sun, Sunset, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'

const THEMES = [
  { id: 'calm-night',    icon: Moon,    label: 'Calm Night',    desc: 'Deep dark blues and lavender' },
  { id: 'morning-mist',  icon: Sun,     label: 'Morning Mist',  desc: 'Soft whites and indigo' },
  { id: 'forest-deep',   icon: Sunset,  label: 'Forest Deep',   desc: 'Lush greens and emerald' },
]

export function UserProfile() {
  const { profile, displayName, updateProfile } = useAuth()
  const { theme, setTheme } = useUIStore()
  const [name, setName]   = useState(profile?.display_name ?? '')
  const [bio, setBio]     = useState(profile?.bio ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile({ display_name: name.trim(), bio: bio.trim(), theme })
    if (error) {
      toast.error('Could not save changes.')
    } else {
      toast.success('Profile updated ✨')
    }
    setSaving(false)
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader title="My Profile" subtitle="Personalize your sanctuary" />

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-medium"
            style={{
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))',
              color: '#fff',
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>ZenZone member</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="glass-card mb-6 space-y-4">
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Personal Info</p>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Display name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-zen" />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-zen resize-none" placeholder="A few words about yourself..." />
          </div>
        </div>

        {/* Theme */}
        <div className="glass-card mb-6">
          <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ id, icon: Icon, label, desc }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className="glass text-left p-3 rounded-xl"
                style={{
                  borderColor: theme === id ? 'var(--accent-blue)' : 'var(--border-glass)',
                  boxShadow: theme === id ? '0 0 20px rgba(124,158,245,0.2)' : 'none',
                }}
              >
                <Icon size={18} className="mb-2" style={{ color: theme === id ? 'var(--accent-blue)' : 'var(--text-secondary)' }} />
                <p className="text-xs font-medium" style={{ color: theme === id ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          <Save size={15} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </PageContainer>
    </PageWrapper>
  )
}

export default UserProfile
