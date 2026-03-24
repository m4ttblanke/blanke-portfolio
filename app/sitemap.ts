import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetchQuery(api.projects.listPublished)
  const base = 'https://blanke-portfolio.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = ['/', '/projects', '/experience', '/coursework', '/about'].map(
    (route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '/' ? 1.0 : 0.8,
    })
  )

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
