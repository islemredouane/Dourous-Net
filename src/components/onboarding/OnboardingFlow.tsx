'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, BookOpen, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/shared/GlassCard'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'student' | 'teacher'
type Level = 'Beginner' | 'Intermediate' | 'Advanced'

interface OnboardingFlowProps {
  userId: string
  defaultName: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const LEVELS: { value: Level; label: string; emoji: string }[] = [
  { value: 'Beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'Intermediate', label: 'Intermediate', emoji: '⚡' },
  { value: 'Advanced', label: 'Advanced', emoji: '🔥' },
]

// ─── Motion variants ──────────────────────────────────────────────────────────

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

const pageTransition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow-sm">
        <BookOpen className="h-4 w-4 text-white" />
      </div>
      <span
        className="text-base font-700 text-white"
        style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}
      >
        Dourous-Net
      </span>
    </div>
  )
}

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
          Step {step} of 2
        </span>
        <span className="text-xs font-medium text-indigo-400">
          {step === 1 ? '50%' : '100%'}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: step === 1 ? '0%' : '50%' }}
          animate={{ width: step === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Role Card ─────────────────────────────────────────────────────────────────

interface RoleCardProps {
  role: 'student' | 'teacher'
  selected: boolean
  onSelect: () => void
}

const ROLE_DATA = {
  student: {
    emoji: '🎓',
    gradient: 'from-indigo-500 to-purple-600',
    title: "I'm a Learner",
    subtitle: 'Discover sessions, enroll and track your progress',
    bullets: [
      'Access expert-led sessions',
      'Track your progress',
      'Submit assignments',
    ],
  },
  teacher: {
    emoji: '📖',
    gradient: 'from-cyan-400 to-indigo-500',
    title: "I'm a Teacher",
    subtitle: 'Share your knowledge and reach Algerian students',
    bullets: [
      'Publish your sessions',
      'See enrollment stats',
      'Build your audience',
    ],
  },
}

function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  const data = ROLE_DATA[role]

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="relative w-full rounded-2xl p-8 text-left transition-all duration-300 focus:outline-none"
      style={{
        background: selected
          ? 'rgba(99, 102, 241, 0.12)'
          : 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: selected
          ? '1px solid #6366f1'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: selected
          ? '0 0 40px rgba(99, 102, 241, 0.35), inset 0 0 0 1px rgba(99, 102, 241, 0.2)'
          : 'none',
      }}
    >
      {/* Selected badge */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500"
          >
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji circle */}
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${data.gradient}`}
        style={{
          boxShadow: selected
            ? '0 0 24px rgba(99, 102, 241, 0.4)'
            : '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <span className="text-2xl leading-none">{data.emoji}</span>
      </div>

      {/* Text */}
      <h3
        className="mb-1.5 text-xl font-bold text-white"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        {data.title}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-400">
        {data.subtitle}
      </p>

      {/* Bullets */}
      <ul className="space-y-2.5">
        {data.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-2.5 text-sm text-slate-300">
            <span
              className="flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(99, 102, 241, 0.25)' }}
            >
              <Check className="h-2.5 w-2.5 text-indigo-400" strokeWidth={2.5} />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
    </motion.button>
  )
}

// ─── Step 1: Role Selection ────────────────────────────────────────────────────

interface Step1Props {
  role: Role | null
  onSelect: (r: Role) => void
  onContinue: () => void
}

function Step1({ role, onSelect, onContinue }: Step1Props) {
  return (
    <motion.div
      key="step1"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="flex min-h-screen flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        <Logo />
        <div className="w-56">
          <ProgressBar step={1} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-purple-600/8 blur-3xl" />

        <div className="relative z-10 w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-12 text-center">
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400"
            >
              Getting started
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mb-4 text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Who are{' '}
              <GradientText>you?</GradientText>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-base text-slate-400"
            >
              Tell us how you&apos;ll use Dourous-Net
            </motion.p>
          </div>

          {/* Role cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.45 }}
            className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
          >
            <RoleCard role="student" selected={role === 'student'} onSelect={() => onSelect('student')} />
            <RoleCard role="teacher" selected={role === 'teacher'} onSelect={() => onSelect('teacher')} />
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4 }}
          >
            <button
              type="button"
              onClick={onContinue}
              disabled={!role}
              className="w-full rounded-xl py-4 text-base font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: role
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'rgba(99, 102, 241, 0.3)',
                boxShadow: role ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none',
              }}
            >
              Continue →
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Step 2: Profile Details ───────────────────────────────────────────────────

interface Step2Props {
  role: Role
  defaultName: string
  onBack: () => void
  onSubmit: (data: { name: string; field: string; level: Level; bio: string }) => Promise<void>
  submitting: boolean
  error: string | null
}

function Step2({ role, defaultName, onBack, onSubmit, submitting, error }: Step2Props) {
  const [name, setName] = useState(defaultName)
  const [field, setField] = useState<string | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [bio, setBio] = useState('')

  const isTeacher = role === 'teacher'
  const canSubmit = name.trim() && field && level && (!isTeacher || bio.trim())

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ name: name.trim(), field: field!, level: level!, bio })
  }

  return (
    <motion.div
      key="step2"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="flex min-h-screen flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        <Logo />
        <div className="w-56">
          <ProgressBar step={2} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center px-4 py-10">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Back + heading */}
          <div className="mb-8">
            <button
              type="button"
              onClick={onBack}
              className="mb-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Almost there
            </p>
            <h1
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Set up your <GradientText>profile</GradientText>
            </h1>
            <p className="mt-2 text-slate-400">
              {isTeacher
                ? 'Help students discover you and your expertise'
                : 'Personalise your learning experience'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <GlassCard className="space-y-8 p-8">
              {/* Full name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-200">
                  Full name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30"
                />
              </div>

              {/* Field */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-200">
                  Your field of {isTeacher ? 'expertise' : 'study'}{' '}
                  <span className="text-red-400">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FIELDS.map((f) => {
                    const active = field === f
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setField(f)}
                        className="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200"
                        style={{
                          borderColor: active ? '#6366f1' : 'rgba(51, 65, 85, 0.8)',
                          background: active ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255,255,255,0.04)',
                          color: active ? '#a5b4fc' : '#94a3b8',
                          boxShadow: active ? '0 0 12px rgba(99, 102, 241, 0.25)' : 'none',
                        }}
                      >
                        {f}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Level */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-200">
                  Your level <span className="text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {LEVELS.map(({ value, label, emoji }) => {
                    const active = level === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setLevel(value)}
                        className="rounded-xl border p-4 text-center transition-all duration-200"
                        style={{
                          borderColor: active ? '#6366f1' : 'rgba(51, 65, 85, 0.8)',
                          background: active ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                          boxShadow: active ? '0 0 16px rgba(99,102,241,0.2)' : 'none',
                        }}
                      >
                        <div className="mb-1.5 text-2xl leading-none">{emoji}</div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: active ? '#a5b4fc' : '#94a3b8' }}
                        >
                          {label}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-slate-200">
                  About you{' '}
                  <span className={isTeacher ? 'text-red-400' : 'text-slate-500'}>
                    {isTeacher ? '(required)' : '(optional)'}
                  </span>
                </Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required={isTeacher}
                  placeholder={
                    isTeacher
                      ? 'Describe your expertise, teaching approach, and what students will gain from your sessions…'
                      : 'Tell us a bit about yourself and your learning goals… (optional)'
                  }
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-base font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: canSubmit && !submitting
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : 'rgba(99, 102, 241, 0.3)',
                  boxShadow: canSubmit && !submitting
                    ? '0 0 30px rgba(99, 102, 241, 0.4)'
                    : 'none',
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </GlassCard>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Step 3: Success State ─────────────────────────────────────────────────────

function SuccessState() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex min-h-screen flex-col items-center justify-center px-4"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-2xl" />

      <div className="relative z-10 text-center">
        {/* Check circle */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(99,102,241,0.2) 100%)',
            border: '2px solid rgba(34,197,94,0.4)',
            boxShadow: '0 0 60px rgba(34, 197, 94, 0.3), 0 0 120px rgba(99, 102, 241, 0.2)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CheckCircle className="h-14 w-14 text-green-400" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="mb-3 text-4xl font-bold text-white md:text-5xl"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Welcome to{' '}
          <GradientText>Dourous-Net!</GradientText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="text-lg text-slate-400"
        >
          Setting up your experience…
        </motion.p>

        {/* Pulsing dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8 flex items-center justify-center gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-indigo-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function OnboardingFlow({ userId, defaultName }: OnboardingFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit({
    name,
    field,
    level,
    bio,
  }: {
    name: string
    field: string
    level: Level
    bio: string
  }) {
    if (!role) return
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from('students')
        .update({
          full_name: name,
          role,
          field,
          level,
          bio: bio || null,
          onboarded: true,
        })
        .eq('id', userId)

      if (dbError) {
        setError(dbError.message ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      // Show success step, then redirect
      setStep(3)
      setTimeout(() => {
        router.push(role === 'teacher' ? '/teacher' : '/sessions')
        router.refresh()
      }, 2200)
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* Static background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1
            key="step1"
            role={role}
            onSelect={setRole}
            onContinue={() => { if (role) setStep(2) }}
          />
        )}
        {step === 2 && role && (
          <Step2
            key="step2"
            role={role}
            defaultName={defaultName}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        )}
        {step === 3 && <SuccessState key="success" />}
      </AnimatePresence>
    </div>
  )
}
