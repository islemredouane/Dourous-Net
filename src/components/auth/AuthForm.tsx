'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientText } from '@/components/shared/GradientText'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'

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
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const router = useRouter()

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const handleSignUp = async (data: SignUpData) => {
    setErrorMsg(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setSuccessMsg('Check your email to confirm your account, then sign in.')
  }

  const handleSignIn = async (data: SignInData) => {
    setErrorMsg(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('students')
        .select('onboarded')
        .eq('id', user.id)
        .single()
      if (!profile?.onboarded) {
        router.push('/onboarding')
        router.refresh()
        return
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow-md mb-6">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Welcome to{' '}
          <GradientText>Dourous-Net</GradientText>
        </h1>
        <p className="text-slate-400">{"Algeria's digital learning platform"}</p>
      </div>

      {/* Error / Success */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="glass rounded-2xl p-6">
        {/* Google OAuth Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-slate-700 bg-white/5 text-white hover:bg-white/10 hover:border-indigo-500/50 flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0f172a] px-3 text-xs text-slate-500">or continue with email</span>
          </div>
        </div>

        <Tabs defaultValue="signin" onValueChange={() => { setErrorMsg(null); setSuccessMsg(null) }}>
          <TabsList className="w-full bg-white/5 mb-6">
            <TabsTrigger value="signin" className="flex-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin">
            <motion.form
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              onSubmit={signInForm.handleSubmit(handleSignIn)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="si-email" className="text-slate-300">Email</Label>
                <Input
                  id="si-email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
                  {...signInForm.register('email')}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{signInForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="si-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Input
                    id="si-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500 pr-10"
                    {...signInForm.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-xs text-red-400">{signInForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={signInForm.formState.isSubmitting}
                className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm hover:shadow-glow-md transition-all"
              >
                {signInForm.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign In
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </motion.form>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup">
            <motion.form
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              onSubmit={signUpForm.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="su-name" className="text-slate-300">Full Name</Label>
                <Input
                  id="su-name"
                  type="text"
                  placeholder="Yasmine Hadj"
                  className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
                  {...signUpForm.register('fullName')}
                />
                {signUpForm.formState.errors.fullName && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="su-email" className="text-slate-300">Email</Label>
                <Input
                  id="su-email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
                  {...signUpForm.register('email')}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="su-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Input
                    id="su-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500 pr-10"
                    {...signUpForm.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={signUpForm.formState.isSubmitting}
                className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm hover:shadow-glow-md transition-all"
              >
                {signUpForm.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Create Account
              </Button>

              <p className="text-center text-xs text-slate-600">
                By signing up, you agree to use this platform responsibly.
              </p>
            </motion.form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
