import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/x-icon'

export default function favicon() {
  return new ImageResponse(
    <div
      style={{
        width: '32px',
        height: '32px',
        background: '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        fontFamily: 'system-ui',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
      }}
    >
      MB
    </div>
  )
}
