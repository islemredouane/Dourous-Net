import { AuthForm } from '@/components/auth/AuthForm'

export const metadata = {
  title: 'Sign In / Sign Up — Dourous-Net',
}

export default function AuthPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full">
        <AuthForm />
      </div>
    </div>
  )
}
