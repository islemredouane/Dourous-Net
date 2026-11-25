import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_CONFIG } from '@/lib/constants'
import { isSupabaseOffline } from '@/lib/supabase/reachability'
import type { Database } from '@/types/database'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_CONFIG.url}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/sessions`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/teachers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_CONFIG.url}/auth`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return staticEntries
  }

  try {
    const offline = await isSupabaseOffline()
    if (offline) {
      return staticEntries
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const [{ data: sessions }, { data: teachers }] = await Promise.race([
      Promise.all([
        supabase
          .from('sessions')
          .select('id, created_at')
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('students')
          .select('id, created_at')
          .eq('role', 'teacher')
          .order('created_at', { ascending: false })
          .limit(100),
      ]),
      new Promise<[{ data: null }, { data: null }]>((resolve) =>
        setTimeout(() => resolve([{ data: null }, { data: null }]), 2500),
      ),
    ])

    const sessionEntries: MetadataRoute.Sitemap = (sessions ?? []).map((row) => ({
      url: `${SITE_CONFIG.url}/sessions/${row.id}`,
      lastModified: row.created_at ? new Date(row.created_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const teacherEntries: MetadataRoute.Sitemap = (teachers ?? []).map((row) => ({
      url: `${SITE_CONFIG.url}/teachers/${row.id}`,
      lastModified: row.created_at ? new Date(row.created_at) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticEntries, ...sessionEntries, ...teacherEntries]
  } catch {
    return staticEntries
  }
}
