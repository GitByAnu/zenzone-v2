import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

const DEFAULT_WORK = 25 * 60   // 25 minutes
const DEFAULT_BREAK = 5 * 60   // 5 minutes
const LONG_BREAK = 15 * 60     // 15 minutes after 4 sessions

export function usePomodoro() {
  const { userId } = useAuth()
  const [mode, setMode] = useState('work')          // 'work' | 'break' | 'long-break'
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [taskDescription, setTaskDescription] = useState('')
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  const duration = {
    work: DEFAULT_WORK,
    break: DEFAULT_BREAK,
    'long-break': LONG_BREAK,
  }[mode]

  const progress = ((duration - timeLeft) / duration) * 100

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const saveSession = useCallback(async () => {
    if (!userId) return
    await supabase.from('focus_sessions').insert({
      user_id: userId,
      duration_minutes: Math.floor(DEFAULT_WORK / 60),
      task_description: taskDescription || null,
      completed: true,
      ended_at: new Date().toISOString(),
    })
  }, [userId, taskDescription])

  const handleComplete = useCallback(async () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)

    if (mode === 'work') {
      await saveSession()
      const newSessions = sessions + 1
      setSessions(newSessions)

      // Every 4 sessions = long break
      if (newSessions % 4 === 0) {
        setMode('long-break')
        setTimeLeft(LONG_BREAK)
      } else {
        setMode('break')
        setTimeLeft(DEFAULT_BREAK)
      }

      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('ZenZone 🧘', {
          body: 'Focus session complete! Time for a break.',
          icon: '/favicon.svg',
        })
      }
    } else {
      setMode('work')
      setTimeLeft(DEFAULT_WORK)
    }
  }, [mode, sessions, saveSession])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning, handleComplete])

  // Update page title while running
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(timeLeft)} · ZenZone`
    } else {
      document.title = 'ZenZone — Your Digital Sanctuary'
    }
    return () => { document.title = 'ZenZone — Your Digital Sanctuary' }
  }, [isRunning, timeLeft])

  const start = () => {
    startTimeRef.current = Date.now()
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }

  const pause = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(duration)
  }

  const switchMode = (newMode) => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(duration[newMode] ?? DEFAULT_WORK)
  }

  return {
    mode,
    timeLeft,
    isRunning,
    sessions,
    progress,
    taskDescription,
    setTaskDescription,
    formatTime,
    start,
    pause,
    reset,
    switchMode,
    formattedTime: formatTime(timeLeft),
  }
}
