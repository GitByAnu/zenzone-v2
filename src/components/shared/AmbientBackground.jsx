import { useUIStore } from '@/store/uiStore'
import { useEffect } from 'react'

const ORB_CONFIGS = {
  'calm-night': [
    { size: 600, x: '10%',  y: '5%',  color: 'rgba(124,158,245,0.12)', delay: '0s',   dur: '10s' },
    { size: 500, x: '65%',  y: '15%', color: 'rgba(167,139,250,0.1)',  delay: '3s',   dur: '13s' },
    { size: 400, x: '30%',  y: '55%', color: 'rgba(94,234,212,0.07)',  delay: '6s',   dur: '9s'  },
    { size: 350, x: '75%',  y: '60%', color: 'rgba(124,158,245,0.08)', delay: '1.5s', dur: '11s' },
  ],
  'morning-mist': [
    { size: 600, x: '5%',   y: '0%',  color: 'rgba(99,102,241,0.1)',   delay: '0s',   dur: '10s' },
    { size: 500, x: '60%',  y: '10%', color: 'rgba(139,92,246,0.08)',  delay: '4s',   dur: '14s' },
    { size: 450, x: '20%',  y: '50%', color: 'rgba(167,243,208,0.15)', delay: '7s',   dur: '8s'  },
  ],
  'forest-deep': [
    { size: 550, x: '8%',   y: '8%',  color: 'rgba(52,211,153,0.1)',   delay: '0s',   dur: '12s' },
    { size: 480, x: '60%',  y: '20%', color: 'rgba(16,185,129,0.08)',  delay: '5s',   dur: '10s' },
    { size: 400, x: '35%',  y: '60%', color: 'rgba(52,211,153,0.07)',  delay: '2s',   dur: '15s' },
  ],
}

export default function AmbientBackground() {
  const theme = useUIStore((s) => s.theme)

  // Sync data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const orbs = ORB_CONFIGS[theme] ?? ORB_CONFIGS['calm-night']

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            filter: 'blur(80px)',
            animation: `float ${orb.dur} ease-in-out ${orb.delay} infinite`,
            transform: 'translateZ(0)',
          }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
