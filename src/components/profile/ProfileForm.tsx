'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, CheckCircle, GraduationCap, Loader2, Lock, Save, User } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import type { Student } from '@/types'

interface ProfileFormProps {
  readonly profile: Student
}

const LEVELS = [
  { value: 'Beginner',     label: 'Beginner',     color: 'border-emerald-500 bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
  { value: 'Intermediate', label: 'Intermediate', color: 'border-yellow-500 bg-yellow-500/15 text-yellow-400',   dot: 'bg-yellow-400' },
  { value: 'Advanced',     label: 'Advanced',     color: 'border-red-500 bg-red-500/15 text-red-400',           dot: 'bg-red-400' },
] as const

function memberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const { upload, uploading } = useUpload()

  const [fullName, setFullName]     = useState(profile.full_name ?? '')
  const [field, setField]           = useState(profile.field ?? '')
  const [bio, setBio]               = useState(profile.bio ?? '')
  const [level, setLevel]           = useState<typeof LEVELS[number]['value']>(profile.level ?? 'Beginner')
  const [avatarUrl, setAvatarUrl]   = useState<string | null>(profile.avatar_url ?? null)
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const initial = (profile.full_name || '?').charAt(0).toUpperCase()
  const currentLevel = LEVELS.find((l) => l.value === level)!

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    const { url, error: uploadError } = await upload(file, 'avatars', profile.id)
    if (uploadError || !url) { setError(uploadError?.message ?? 'Avatar upload failed'); return }
    setAvatarUrl(url)
    const supabase = createClient()
    await supabase.from('students').update({ avatar_url: url }).eq('id', profile.id)
  }

  const handleSave = async () => {
    if (!fullName.trim()) { setError('Name cannot be empty'); return }
    setSaving(true); setError(null); setSaved(false)
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('students')
      .update({ full_name: fullName.trim(), bio: bio.trim() || null, level, field: field.trim() || null })
      .eq('id', profile.id)
    setSaving(false)
    if (updateError) { setError(updateError.message); return }
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">

      {/* ── LEFT: Profile Summary Card ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f1e] p-6 flex flex-col items-center text-center">

          {/* Avatar with hover overlay */}
          <div className="relative group mb-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-indigo-500/40 transition-all duration-200">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white">
                  {initial}
                </div>
              )}
            </div>

            {/* Hover overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {uploading
                ? <Loader2 className="h-5 w-5 animate-spin text-white" />
                : <><Camera className="h-5 w-5 text-white" /><span className="text-[10px] font-medium text-white">Change</span></>
              }
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Name */}
          <h3 className="text-base font-semibold text-white leading-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {profile.full_name || 'Your Name'}
          </h3>

          {/* Email */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3 w-3" />
            {profile.email}
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
              {profile.role === 'teacher'
                ? <><GraduationCap className="h-3 w-3" />Teacher</>
                : <><User className="h-3 w-3" />Student</>
              }
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${currentLevel.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${currentLevel.dot}`} />
              {currentLevel.label}
            </span>
          </div>

          {/* Member since */}
          <p className="mt-4 text-xs text-slate-600">
            Member since {memberSince(profile.created_at)}
          </p>
        </div>

        {/* Tip card */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f1e] p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1">Profile tip</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            A complete profile with a bio and level helps teachers tailor their content to you.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Edit Form ── */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f1e] p-6 space-y-6">

        {/* Personal info */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Personal Information
          </h4>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name *</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Field / Specialty <span className="normal-case text-slate-600">(optional)</span>
              </Label>
              <Input
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g. Computer Science, Mathematics, Languages…"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Email <span className="normal-case text-slate-600">— managed by your auth provider</span>
              </Label>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 h-11">
                <Lock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                <span className="text-sm text-slate-500">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05]" />

        {/* Level */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Learning Level
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  level === l.value
                    ? l.color
                    : 'border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-white/[0.12] hover:text-slate-300'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${level === l.value ? l.dot : 'bg-slate-700'}`} />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.05]" />

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              About Me
            </h4>
            <span className={`text-xs tabular-nums ${bio.length > 280 ? 'text-red-400' : 'text-slate-600'}`}>
              {bio.length}/300
            </span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            rows={4}
            placeholder="Tell others about yourself — your background, expertise, or what you're learning…"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 px-4 py-3 text-sm resize-none transition-colors"
          />
        </div>

        {/* Feedback */}
        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Profile saved successfully!
          </div>
        )}

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={saving || uploading}
          className="w-full h-11 bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm rounded-xl font-medium"
        >
          {saving
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
            : <><Save className="mr-2 h-4 w-4" />Save Changes</>
          }
        </Button>
      </div>
    </div>
  )
}
