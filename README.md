# 🌿 ZenZone V2 — Digital Sanctuary

> A professionally built wellness platform for mindfulness, focus, and emotional wellbeing.
> Built by **Anupama Bain** & **Arijit Adhikary**

---

## 🚀 Quick Start (5 steps)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/zenzone-v2
cd zenzone-v2
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Open **SQL Editor** → paste the entire contents of `supabase-schema.sql` → Run
3. Go to **Authentication → Providers** → Enable **Google** OAuth
4. Copy your **Project URL** and **anon/public** key from Settings → API

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

**YouTube API Key:** [console.cloud.google.com](https://console.cloud.google.com) → New project → Enable "YouTube Data API v3" → Create API key

### 4. Run locally

```bash
npm run dev
# Open http://localhost:5173
```

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time)
vercel

# Add environment variables in Vercel Dashboard:
# Settings → Environment Variables → add the 3 VITE_ vars
```

Or connect GitHub repo in [vercel.com/new](https://vercel.com/new) for automatic deployments.

---

## 🛡️ Admin Setup

After Anupama and Arijit create their accounts through the app:

1. Go to **Supabase Dashboard → Table Editor → profiles**
2. Find your rows and set `is_admin = true`

Or run in SQL Editor:
```sql
UPDATE profiles SET is_admin = true
WHERE display_name IN ('Anupama Bain', 'Arijit Adhikary');
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Card, Skeleton, etc.
│   ├── layout/      # Navbar, Sidebar, PageWrapper
│   └── shared/      # AmbientBackground, BreathingRing, ProtectedRoute
├── pages/
│   ├── auth/        # Login, Register
│   ├── meditation/  # MeditationHub
│   ├── music/       # MusicZone (YouTube API)
│   ├── productivity/# TodoList, PomodoroTimer
│   ├── wellness/    # BreathingExercise, MoodTracker, Journal, Affirmations
│   ├── profile/     # UserProfile, WellnessStats
│   └── admin/       # AdminDashboard (Anupama + Arijit only)
├── hooks/           # useAuth, usePomodoro
├── store/           # Zustand: authStore, uiStore
├── lib/             # supabase.js, youtube.js
├── services/        # API layer: auth, todos, mood, journal
└── styles/          # index.css (Tailwind + design tokens)
```

---

## 🎨 Design System

### Themes
| Theme | Description |
|-------|-------------|
| `calm-night` (default) | Dark blues + lavender, for evening use |
| `morning-mist` | Soft whites + indigo, for daytime use |
| `forest-deep` | Deep greens + emerald, immersive nature |

### Typography
- **Display/Hero:** Playfair Display
- **Body:** DM Sans
- **Timer/Code:** JetBrains Mono

---

## 🗂️ Features

| Feature | Status | Auth required |
|---------|--------|---------------|
| Landing page | ✅ | No |
| Authentication (email + Google) | ✅ | — |
| Personalized Dashboard | ✅ | Yes |
| To-Do List (full CRUD, priorities) | ✅ | Yes |
| Pomodoro Timer (persisted sessions) | ✅ | Yes |
| Meditation Hub | ✅ | Yes |
| Breathing Exercise (4-7-8, box, 2:1) | ✅ | Yes |
| Music Zone (YouTube API) | ✅ | Yes |
| Mood Tracker (daily log + history) | ✅ | Yes |
| Journal (private entries) | ✅ | Yes |
| Daily Affirmations | ✅ | Yes |
| Wellness Stats | ✅ | Yes |
| User Profile + Theme switcher | ✅ | Yes |
| Admin Panel | ✅ | Admin only |

---

## 🔒 Security

- All secrets in environment variables (never committed)
- Supabase Row Level Security on every table
- Admin role enforced at both React router + database level
- Email verification on registration
- No localStorage abuse — Supabase manages secure sessions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS + CSS variables |
| Animation | Framer Motion |
| State | Zustand |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| YouTube | YouTube Data API v3 |
| Deployment | Vercel |
| Icons | Lucide React |
| Toast | react-hot-toast |

---

*ZenZone V2 — From hackathon prototype to production-grade digital sanctuary.*
