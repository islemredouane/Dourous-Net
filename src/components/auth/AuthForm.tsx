'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { switchDemoRole } from '@/lib/demo/client-helpers'
import { DEMO_ACCOUNTS } from '@/lib/demo/seed'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Sparkles,
} from 'lucide-react'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignUpData = z.infer<typeof signUpSchema>
type SignInData = z.infer<typeof signInSchema>

export function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [signupStep, setSignupStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState<'student' | 'teacher' | null>(null)
  const router = useRouter()
  const prefersReduced = useReducedMotion()

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
  })

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const handleModeChange = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode)
    setErrorMsg(null)
    setSuccessMsg(null)
    if (nextMode === 'signin') {
      setSignupStep(1)
    }
  }

  const handleDemoLogin = async (role: 'student' | 'teacher') => {
    setErrorMsg(null)
    setDemoLoading(role)
    await switchDemoRole(role)
    router.push(role === 'teacher' ? '/teacher' : '/dashboard')
    router.refresh()
  }

  const handleSignUpNext = async () => {
    setErrorMsg(null)
    const ok = await signUpForm.trigger(['fullName', 'email'])
    if (ok) {
      setSignupStep(2)
    }
  }

  const handleSignUp = async (data: SignUpData) => {
    setErrorMsg(null)
    setSuccessMsg(null)
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    if (authData.session) {
      router.push('/onboarding')
      router.refresh()
    } else {
      setSuccessMsg(
        'Check your email for a confirmation link before signing in.',
      )
    }
  }

  const handleSignIn = async (data: SignInData) => {
    setErrorMsg(null)
    setSuccessMsg(null)
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    const { data: profile } = await supabase
      .from('students')
      .select('role, onboarded')
      .eq('id', authData.user.id)
      .single()

    if (!profile?.onboarded) {
      router.push('/onboarding')
    } else if (profile.role === 'teacher') {
      router.push('/teacher')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) setErrorMsg(error.message)
  }

  const watchName = signUpForm.watch('fullName')
  const watchEmail = signUpForm.watch('email')

  return (
    <div className="w-full max-w-[430px] mx-auto">
      <div className="mb-4">
        <p className="eyebrow text-[#7F97C7] mb-1">
          {mode === 'signin' ? 'Account Access' : `Create Account · Step ${signupStep} of 2`}
        </p>
        <h1
          className="text-2xl sm:text-[1.75rem] font-bold text-white tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          {mode === 'signin' ? 'Welcome back' : 'Join Dourous-Net'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
          {mode === 'signin'
            ? 'Sign in to access your courses, quizzes, and study history.'
            : signupStep === 1
            ? 'Step 1 of 2 — Tell us your name and email address.'
            : 'Step 2 of 2 — Choose a strong password to finish.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
          {successMsg}
        </div>
      )}

      {/* Framer Motion Sliding Mode Switcher */}
      <div
        role="tablist"
        aria-label="Authentication mode"
        className="relative mb-4 grid grid-cols-2 rounded-full border border-[#DDE3EC]/12 bg-[#080E1D] p-1.5"
      >
        {(['signin', 'signup'] as const).map((tab) => {
          const active = mode === tab
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleModeChange(tab)}
              className={cn(
                'relative h-10 rounded-full text-[13px] font-semibold transition-colors',
                active ? 'text-white' : 'text-[#8A94A8] hover:text-white',
              )}
            >
              {active && (
                <motion.span
                  layoutId="auth-mode-pill"
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 32 }
                  }
                  className="absolute inset-0 z-0 rounded-full bg-[#2563EB] shadow-md shadow-[#2563EB]/25"
                />
              )}
              <span className="relative z-10">
                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-3xl border border-[#DDE3EC]/12 bg-[#121A2E] p-5">
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'signin' ? (
            <motion.form
              key="signin-panel"
              initial={prefersReduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onSubmit={signInForm.handleSubmit(handleSignIn)}
              className="space-y-3"
            >
              <div className="space-y-1">
                <Label htmlFor="si-email" className="eyebrow text-[#8A94A8]">
                  Email
                </Label>
                <Input
                  id="si-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
                  {...signInForm.register('email')}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-xs text-red-400">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="si-password" className="eyebrow text-[#8A94A8]">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] text-[#AEC6FF] hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="si-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0 pr-10"
                    {...signInForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94A8] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-xs text-red-400">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={signInForm.formState.isSubmitting}
                className="flex w-full h-11 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-50"
              >
                {signInForm.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                <span>Sign In</span>
              </button>
            </motion.form>
          ) : (
            <motion.div
              key={`signup-step-${signupStep}`}
              initial={prefersReduced ? false : { opacity: 0, x: signupStep === 1 ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: signupStep === 1 ? 10 : -10 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {/* Two-step progress bar (Medlink register pattern) */}
              <div className="mb-3.5 flex items-center gap-2" aria-hidden="true">
                <span className="h-1 flex-1 rounded-full bg-[#2563EB]" />
                <span
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    signupStep === 2 ? 'bg-[#2563EB]' : 'bg-[#DDE3EC]/12',
                  )}
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A94A8]">
                  Step {signupStep}/2
                </span>
              </div>

              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-3">
                {signupStep === 1 ? (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="su-name" className="eyebrow text-[#8A94A8]">
                        Full Name
                      </Label>
                      <Input
                        id="su-name"
                        type="text"
                        placeholder="Yasmine Hadj"
                        className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
                        {...signUpForm.register('fullName')}
                      />
                      {signUpForm.formState.errors.fullName && (
                        <p className="text-xs text-red-400">
                          {signUpForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="su-email" className="eyebrow text-[#8A94A8]">
                        Email
                      </Label>
                      <Input
                        id="su-email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
                        {...signUpForm.register('email')}
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-xs text-red-400">
                          {signUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSignUpNext}
                      className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#DDE3EC]/12 bg-[#080E1D] px-3 py-2 text-xs">
                      <span className="truncate text-[#DDE3EC]">
                        <strong className="font-semibold text-white">{watchName}</strong>
                        <span className="mx-1.5 text-[#7F97C7]">·</span>
                        <span className="text-[#94A3B8]">{watchEmail}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="inline-flex items-center gap-1 shrink-0 font-mono text-[10.5px] text-[#AEC6FF] hover:text-white transition-colors"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Edit
                      </button>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="su-password" className="eyebrow text-[#8A94A8]">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="su-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 characters"
                          className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0 pr-10"
                          {...signUpForm.register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94A8] hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-xs text-red-400">
                          {signUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={signUpForm.formState.isSubmitting}
                      className="flex w-full h-11 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-50"
                    >
                      {signUpForm.formState.isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      <span>Create Account</span>
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DDE3EC]/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#121A2E] px-3 font-mono text-[10px] uppercase tracking-wider text-[#8A94A8]">
              or instant access
            </span>
          </div>
        </div>

        {/* Google OAuth + 1-click Demo Roles */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full h-11 items-center justify-center gap-2.5 rounded-full border border-[#DDE3EC]/18 bg-[#080E1D] px-4 text-[13.5px] font-semibold text-white hover:border-[#3B82F6] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="rounded-2xl border border-[#3B82F6]/25 bg-[#080E1D] p-3">
            <div className="mb-2 flex items-center justify-between px-0.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#AEC6FF]">
                <Sparkles className="h-3 w-3 text-[#60A5FA]" />
                Portfolio Demo Accounts
              </span>
              <span className="font-mono text-[10px] text-[#7F97C7]">1-click sandbox</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={demoLoading !== null}
                onClick={() => handleDemoLogin('student')}
                className="flex min-h-[56px] flex-col items-start justify-center gap-0.5 rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] px-3.5 py-2.5 text-left hover:border-[#3B82F6] hover:bg-[#162038] disabled:opacity-60 transition-colors"
              >
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                  {demoLoading === 'student' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#60A5FA]" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5 text-[#60A5FA]" />
                  )}
                  Student
                </span>
                <span className="text-[11.5px] text-[#8A94A8] truncate w-full">
                  {DEMO_ACCOUNTS.student.full_name}
                </span>
              </button>
              <button
                type="button"
                disabled={demoLoading !== null}
                onClick={() => handleDemoLogin('teacher')}
                className="flex min-h-[56px] flex-col items-start justify-center gap-0.5 rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] px-3.5 py-2.5 text-left hover:border-emerald-400/60 hover:bg-[#162038] disabled:opacity-60 transition-colors"
              >
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                  {demoLoading === 'teacher' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  Teacher
                </span>
                <span className="text-[11.5px] text-[#8A94A8] truncate w-full">
                  {DEMO_ACCOUNTS.teacher.full_name}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
