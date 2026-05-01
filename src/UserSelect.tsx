import { useState } from 'react'

interface Props {
  onSelect: (user: 'ashwin' | 'rufi') => void
}

export default function UserSelect({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: 24,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 13, letterSpacing: 4, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>
          Workout Tracker
        </div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: '#E8E8F0', letterSpacing: 2 }}>
          WHO'S TRAINING TODAY?
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Ashwin */}
        <div
          onClick={() => onSelect('ashwin')}
          onMouseEnter={() => setHovered('ashwin')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 160, cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.2s',
            transform: hovered === 'ashwin' ? 'scale(1.05)' : 'scale(1)',
          }}>
          <div style={{
            width: 160, height: 160, borderRadius: 16,
            background: hovered === 'ashwin'
              ? 'linear-gradient(135deg, #FF6B35, #FF3366)'
              : '#1A1A2E',
            border: `3px solid ${hovered === 'ashwin' ? '#FF6B35' : '#2A2A3E'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, transition: 'all 0.2s',
            fontSize: 64,
          }}>
            💪
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700,
            color: hovered === 'ashwin' ? '#FF6B35' : '#E8E8F0',
            transition: 'color 0.2s',
          }}>
            Ashwin
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            PPL Program
          </div>
        </div>

        {/* Rufi */}
        <div
          onClick={() => onSelect('rufi')}
          onMouseEnter={() => setHovered('rufi')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 160, cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.2s',
            transform: hovered === 'rufi' ? 'scale(1.05)' : 'scale(1)',
          }}>
          <div style={{
            width: 160, height: 160, borderRadius: 16,
            background: hovered === 'rufi'
              ? 'linear-gradient(135deg, #E8547A, #F4A261)'
              : '#1A1A2E',
            border: `3px solid ${hovered === 'rufi' ? '#E8547A' : '#2A2A3E'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, transition: 'all 0.2s',
            fontSize: 64,
          }}>
            🌸
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700,
            color: hovered === 'rufi' ? '#E8547A' : '#E8E8F0',
            transition: 'color 0.2s',
          }}>
            Rufi
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Fat Loss & Tone
          </div>
        </div>
      </div>

      <div style={{ marginTop: 48, fontSize: 11, color: '#333', letterSpacing: 2, textTransform: 'uppercase' }}>
        Your selection will be remembered
      </div>
    </div>
  )
}