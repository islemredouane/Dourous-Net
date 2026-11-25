'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Camera,
  CheckCircle,
  GraduationCap,
  Loader2,
  Lock,
  Save,
  User,
} from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import type { Student } from '@/types'

interface ProfileFormProps {
  readonly profile: Student
}

const LEVELS = [
  { value: 'Beginner', label: 'Beginner', color: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300' },
  { value: 'Intermediate', label: 'Intermediate', color: 'border-amber-400/50 bg-amber-500/15 text-amber-300' },
  { value: 'Advanced', label: 'Advanced', color: 'border-[#3B82F6] bg-[#2563EB]/20 text-[#AEC6FF]' },
] as const

function memberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const { upload, uploading } = useUpload()

  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [field, setField] = useState(profile.field ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [level, setLevel] = useState<(typeof LEVELS)[number]['value']>(
    profile.level ?? 'Beginner',
  )
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url ?? null,
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initial = (profile.full_name || '?').charAt(0).toUpperCase()
  const currentLevel = LEVELS.find((l) => l.value === level)!

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    const { url, error: uploadError } = await upload(file, 'avatars', profile.id)
    if (uploadError || !url) {
      setError(uploadError?.message ?? 'Avatar upload failed')
      return
    }
    setAvatarUrl(url)
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
      .update({
        full_name: fullName.trim(),
        bio: bio.trim() || null,
        level,
        field: field.trim() || null,
      })
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

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
      {/* Left: Dossier Summary */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-[#DDE3EC]/20 bg-[#1B2A55]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#2563EB] text-3xl font-bold text-white">
                  {initial}
                </div>
              )}
            </div>

            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 rounded-full flex cursor-pointer flex-col items-center justify-center gap-1 bg-[#0B1120]/75 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <>
                  <Camera className="h-5 w-5 text-white" />
                  <span className="font-mono text-[10px] uppercase text-white">Change</span>
                </>
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {profile.full_name || 'Your Name'}
          </h2>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A94A8]">
            <Lock className="h-3 w-3" />
            <span className="truncate max-w-[200px]">{profile.email}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3B82F6]/30 bg-[#2563EB]/15 px-3 py-1 font-mono text-[11px] font-medium text-[#AEC6FF]">
              {profile.role === 'teacher' ? (
                <>
                  <GraduationCap className="h-3 w-3" /> Teacher
                </>
              ) : (
                <>
                  <User className="h-3 w-3" /> Student
                </>
              )}
            </span>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${currentLevel.color}`}>
              {currentLevel.label}
            </span>
          </div>

          <p className="mt-4 font-mono text-[11px] text-[#8A94A8]">
            Member since {memberSince(profile.created_at)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-4">
          <p className="eyebrow text-[#7F97C7] mb-1.5">Profile Tip</p>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            A complete field and bio helps instructors and learners identify your academic focus.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 sm:p-7 space-y-6">
        <div className="space-y-4">
          <h3
            className="text-sm font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Personal Information
          </h3>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Full Name *</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Field / Specialty</Label>
            <Input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g. Computer Science, Mathematics, Physics..."
              className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Email (Managed by Auth)</Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#DDE3EC]/10 bg-[#080E1D]/60 px-3.5 h-11 text-sm text-[#8A94A8]">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DDE3EC]/10 pt-5">
          <h3
            className="mb-3 text-sm font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Academic Level
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={`rounded-xl border px-3 py-3 text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
                  level === l.value
                    ? l.color
                    : 'border-[#DDE3EC]/12 bg-[#080E1D] text-[#8A94A8] hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#DDE3EC]/10 pt-5">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              About Me
            </h3>
            <span className={`font-mono text-xs ${bio.length > 280 ? 'text-red-400' : 'text-[#8A94A8]'}`}>
              {bio.length}/300
            </span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            rows={4}
            placeholder="Share your background, research interests, or teaching focus..."
            className="w-full rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus:border-[#3B82F6] focus:outline-none px-3.5 py-3 text-sm resize-none"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
            {error}
          </p>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Profile saved successfully.
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}
