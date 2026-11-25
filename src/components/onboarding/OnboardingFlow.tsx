'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle,
  GraduationCap,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Role = 'student' | 'teacher'
type Level = 'Beginner' | 'Intermediate' | 'Advanced'

interface OnboardingFlowProps {
  userId: string
  email: string
  defaultName: string
}

const FIELDS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Languages',
  'History',
  'Arts & Design',
  'Engineering',
  'Medicine',
  'Economics',
  'Law',
  'Other',
]

const LEVELS: { value: Level; label: string }[] = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
]

const ROLE_DATA = {
  student: {
    icon: BookOpen,
    title: "I'm a Learner",
    subtitle: 'Enroll in structured courses, track lesson completion, and get AI tutoring.',
    bullets: [
      'Stream video curricula from top teachers',
      'Take timed quizzes with instant grading',
      'Submit homework PDFs securely',
    ],
  },
  teacher: {
    icon: GraduationCap,
    title: "I'm a Teacher",
    subtitle: 'Publish structured courses, author quizzes, and mentor students across Algeria.',
    bullets: [
      'Publish multi-lesson video courses',
      'Build timed MCQs with explanations',
      'Review student assignment submissions',
    ],
  },
}

export function OnboardingFlow({
  userId,
  email,
  defaultName,
}: OnboardingFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [name, setName] = useState(defaultName)
  const [field, setField] = useState<string | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTeacher = role === 'teacher'
  const canSubmit = Boolean(name.trim() && field && level && (!isTeacher || bio.trim()))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role || !field || !level || !canSubmit) return
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from('students')
        .upsert(
          {
            id: userId,
            email,
            full_name: name.trim(),
            role,
            field,
            level,
            bio: bio.trim() || null,
            onboarded: true,
          },
          { onConflict: 'id' },
        )

      if (dbError) {
        setError(dbError.message ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      setStep(3)
      setTimeout(() => {
        router.push(role === 'teacher' ? '/teacher' : '/sessions')
        router.refresh()
      }, 1800)
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0B1120] flex flex-col">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 border-b border-[#DDE3EC]/10 bg-[#080E1D]/90 px-6 py-4 md:px-12 flex items-center justify-between gap-4">
        <BrandLogo size={28} />
        <div className="w-44 sm:w-56 space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#8A94A8]">
            <span>Step {Math.min(step, 2)} of 2</span>
            <span className="text-[#AEC6FF]">{step === 1 ? '50%' : '100%'}</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden bg-[#121A2E]">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {step === 1 && (
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
              <p className="eyebrow text-[#7F97C7] mb-2">Getting Started</p>
              <h1
                className="text-3xl sm:text-5xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Choose your role.
              </h1>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Tell us how you&apos;ll use Dourous-Net.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['student', 'teacher'] as const).map((r) => {
                const data = ROLE_DATA[r]
                const Icon = data.icon
                const selected = role === r
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative text-left rounded-3xl border p-7 transition-colors ${
                      selected
                        ? 'border-[#3B82F6] bg-[#162038]'
                        : 'border-[#DDE3EC]/12 bg-[#121A2E] hover:border-[#DDE3EC]/30'
                    }`}
                  >
                    {selected && (
                      <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#2563EB]/15 text-[#AEC6FF]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {data.title}
                    </h2>
                    <p className="mt-1.5 mb-5 text-xs text-[#94A3B8] leading-relaxed">
                      {data.subtitle}
                    </p>
                    <ul className="space-y-2">
                      {data.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs text-[#DDE3EC]">
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              disabled={!role}
              onClick={() => role && setStep(2)}
              className="flex w-full h-12 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-40"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && role && (
          <div className="w-full max-w-xl space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A94A8] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <p className="eyebrow text-[#7F97C7] mb-1.5">Step 02 · Academic Profile</p>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Complete your setup
              </h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 sm:p-7 space-y-6"
            >
              <div className="space-y-1.5">
                <Label htmlFor="onb-name" className="eyebrow text-[#8A94A8]">
                  Full Name *
                </Label>
                <Input
                  id="onb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="eyebrow text-[#8A94A8]">
                  Field of {isTeacher ? 'Expertise' : 'Study'} *
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FIELDS.map((f) => {
                    const active = field === f
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setField(f)}
                        className={`min-h-[40px] rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                          active
                            ? 'border-[#2563EB] bg-[#2563EB] text-white'
                            : 'border-[#DDE3EC]/15 bg-[#080E1D] text-[#8A94A8] hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="eyebrow text-[#8A94A8]">Level *</Label>
                <div className="grid grid-cols-3 gap-2.5">
                  {LEVELS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setLevel(l.value)}
                      className={`min-h-[46px] rounded-2xl border py-3 text-xs font-mono font-semibold uppercase transition-colors ${
                        level === l.value
                          ? 'border-[#3B82F6] bg-[#2563EB]/20 text-[#AEC6FF]'
                          : 'border-[#DDE3EC]/15 bg-[#080E1D] text-[#8A94A8] hover:text-white'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="onb-bio" className="eyebrow text-[#8A94A8]">
                  Bio {isTeacher ? '*' : '(optional)'}
                </Label>
                <textarea
                  id="onb-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required={isTeacher}
                  placeholder={
                    isTeacher
                      ? 'Describe your teaching specialty and background...'
                      : 'Tell us what you are currently studying...'
                  }
                  className="w-full rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] px-3.5 py-3 text-sm text-white placeholder:text-[#8A94A8] focus:border-[#3B82F6] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-45"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-5 max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/15">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Welcome to Dourous-Net
            </h1>
            <p className="text-sm text-[#94A3B8]">
              Your profile is ready. Redirecting to your workspace…
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
