import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        gap: '20px',
      }}
    >
      <div
        style={{
          fontSize: '72px',
          fontWeight: '700',
          color: '#111827',
          letterSpacing: '-2px',
        }}
      >
        Matt Blanke
      </div>
      <div
        style={{
          fontSize: '32px',
          color: '#52525b',
          fontWeight: '400',
        }}
      >
        CS Student & Software Engineer
      </div>
      <div
        style={{
          fontSize: '20px',
          color: '#a1a1aa',
          marginTop: '20px',
        }}
      >
        blanke-portfolio.vercel.app
      </div>
    </div>
  )
}
