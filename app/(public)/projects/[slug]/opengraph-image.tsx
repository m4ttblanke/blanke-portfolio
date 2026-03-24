import { ImageResponse } from 'next/og'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params
  const project = await fetchQuery(api.projects.getBySlug, { slug })

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: '#111827',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Project not found
      </div>
    )
  }

  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        gap: '30px',
      }}
    >
      <div
        style={{
          fontSize: '56px',
          fontWeight: '700',
          color: '#111827',
          maxWidth: '900px',
          lineHeight: '1.2',
        }}
      >
        {project.title}
      </div>
      <div
        style={{
          fontSize: '20px',
          color: '#52525b',
          maxWidth: '900px',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </div>
      <div
        style={{
          fontSize: '16px',
          color: '#a1a1aa',
          marginTop: '20px',
        }}
      >
        blanke-portfolio.vercel.app
      </div>
    </div>
  )
}
