import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait-primary',
    background_color: '#0B1120',
    theme_color: '#0B1120',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-home.webp',
        sizes: '1280x764',
        type: 'image/webp',
        form_factor: 'wide',
        label: 'Dourous-Net Desktop Catalog Search Hub',
      },
      {
        src: '/screenshots/mobile-home.webp',
        sizes: '560x1212',
        type: 'image/webp',
        form_factor: 'narrow',
        label: 'Dourous-Net Mobile Learning App',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Sessions',
        short_name: 'Sessions',
        description: 'Explore structured courses across 6 core disciplines',
        url: '/sessions',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Student Dashboard',
        short_name: 'Dashboard',
        description: 'Resume active courses and quizzes',
        url: '/dashboard',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Educators Directory',
        short_name: 'Teachers',
        description: 'Meet Algerian instructors and explore profiles',
        url: '/teachers',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  }
}
