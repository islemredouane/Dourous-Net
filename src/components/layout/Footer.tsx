import Link from 'next/link'
import { LogoIcon } from '@/components/shared/LogoIcon'
import { GradientText } from '@/components/shared/GradientText'

const links = {
  Platform: [
    { label: 'Browse Courses', href: '/sessions' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Get Started', href: '/auth' },
  ],
  Learn: [
    { label: 'Computer Science', href: '/sessions' },
    { label: 'Mathematics', href: '/sessions' },
    { label: 'Languages', href: '/sessions' },
  ],
  Company: [
    { label: 'About Us', href: '/' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoIcon size={28} />
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                <GradientText>Dourous</GradientText>
                <span className="text-slate-100">-Net</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Algeria&apos;s digital learning platform. Access expert-led courses, track your progress, and grow your skills — anytime, anywhere.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {group}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Dourous-Net. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-slate-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
