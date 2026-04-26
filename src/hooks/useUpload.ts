'use client'

import { useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const upload = useCallback(
    async (
      file: File,
      bucket: 'avatars' | 'thumbnails' | 'submissions',
      userId: string,
    ): Promise<{ url: string | null; error: Error | null }> => {
      setUploading(true)
      setProgress(0)

      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true })

      setProgress(100)
      setUploading(false)

      if (error) return { url: null, error: new Error(error.message) }

      if (bucket === 'submissions') {
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
        return { url: data.publicUrl, error: null }
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      return { url: data.publicUrl, error: null }
    },
    [],
  )

  return { upload, uploading, progress }
}
