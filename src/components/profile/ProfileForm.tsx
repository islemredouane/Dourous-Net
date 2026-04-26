'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2, Save, Upload } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import type { Student } from '@/types'

interface ProfileFormProps {
  readonly profile: Student
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const { upload, uploading } = useUpload()

  const [fullName, setFullName] = useState(profile.full_name)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [level, setLevel] = useState(profile.level ?? 'Beginner')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url ?? null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { url, error: uploadError } = await upload(file, 'avatars', profile.id)
    if (uploadError || !url) {
      setError(uploadError?.message ?? 'Avatar upload failed')
      return
    }
    setAvatarPreview(url)

    const supabase = createClient()
    await supabase.from('students').update({ avatar_url: url }).eq('id', profile.id)
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('Name cannot be empty')
      return
    }
    setSaving(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('students')
      .update({ full_name: fullName.trim(), bio: bio.trim() || null, level })
      .eq('id', profile.id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  const initial = (profile.full_name || '?').charAt(0).toUpperCase()

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <GlassCard className="flex flex-col items-center gap-5 py-8 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-glow-md">
              {initial}
            </div>
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-2 -right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-white shadow hover:bg-indigo-600 transition-colors"
            title="Change avatar"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {profile.full_name}
          </h3>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <p className="mt-1 text-xs text-slate-600">Click the upload icon to change your avatar (max 5 MB)</p>
        </div>
      </GlassCard>

      {/* Fields */}
      <GlassCard className="space-y-5">
        <div className="space-y-2">
          <Label className="text-slate-300">Full Name *</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Level</Label>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  level === l
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-700 bg-white/5 text-slate-400 hover:border-indigo-500/50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Bio <span className="text-slate-600">(optional)</span></Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell others about yourself — your background, expertise, or what you're learning…"
            className="w-full rounded-lg bg-white/5 border border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            Profile saved successfully!
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm"
        >
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Save Profile</>
          )}
        </Button>
      </GlassCard>
    </div>
  )
}
