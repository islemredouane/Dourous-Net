import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

const DISALLOWED_PRIVATE_ROUTES = [
  '/api/',
  '/dashboard',
  '/teacher',
  '/profile',
  '/onboarding',
  '/offline',
  '/auth/forgot-password',
  '/auth/update-password',
]

const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Bytespider',
  'TikTokSpider',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Amazonbot',
  'Applebot-Extended',
  'PetalBot',
  'Google-CloudVertexBot',
  'Timpibot',
]

const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PRIVATE_ROUTES,
      },
      ...AI_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOWED_PRIVATE_ROUTES,
      })),
      ...AI_TRAINING_BOTS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  }
}
