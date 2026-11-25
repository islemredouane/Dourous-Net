'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { GitHubStarButton } from '@/components/shared/GitHubStarButton'
import { InstallAppButton } from '@/components/pwa/InstallAppButton'
import { DISCIPLINES, SITE_CONFIG } from '@/lib/constants'
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react'

export function Footer() {
  const { user, profile, loading } = useUser()
  const [copied, setCopied] = useState(false)
  const year = new Date().getFullYear()

  const footerColumns = [
    {
      title: 'Platform',
      links: [
        { label: 'Browse Sessions', href: '/sessions' },
        { label: 'Instructors', href: '/teachers' },
        { label: 'How It Works', href: '/about' },
        ...(loading
          ? []
          : user
          ? [
              { label: 'My Dashboard', href: '/dashboard' },
              ...(profile?.role === 'teacher'
                ? [{ label: 'Teacher Studio', href: '/teacher' }]
                : []),
            ]
          : [{ label: 'Get Started', href: '/auth' }]),
      ],
    },
    {
      title: 'Disciplines',
      links: DISCIPLINES.slice(0, 5).map((d) => ({
        label: d.label,
        href: `/sessions?category=${encodeURIComponent(d.value)}`,
      })),
    },
    {
      title: 'Trust & Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        ...(loading
          ? []
          : user
          ? [{ label: 'Account Settings', href: '/profile' }]
          : [{ label: 'Sign In / Join', href: '/auth' }]),
      ],
    },
  ]

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      className="relative overflow-hidden border-t border-[#DDE3EC]/10 bg-[#070B16] pb-28 md:pb-0"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Dourous-Net Footer
      </h2>

      {/* Subtle architectural watermark (INSIGHT style) */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.14em] select-none text-center font-black leading-none tracking-tighter text-white/[0.025] text-[15vw] lg:text-[13rem]"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        DOUROUS-NET
      </p>

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-10">
        {/* 1. Action & Contact Band */}
        <div className="py-12 md:py-14 grid lg:grid-cols-12 gap-8 lg:items-end border-b border-[#DDE3EC]/10">
          <div className="lg:col-span-7">
            <p className="eyebrow text-[#7F97C7]">Educators &amp; Learners</p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="group mt-3 inline-flex max-w-full items-center gap-2 sm:gap-3 font-bold text-white text-[clamp(1.05rem,5.2vw,2.25rem)] whitespace-nowrap tracking-tight hover:text-[#AEC6FF] transition-colors"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <span>{SITE_CONFIG.email}</span>
              <ArrowUpRight className="h-5 w-5 sm:h-8 sm:w-8 shrink-0 text-[#7F97C7] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#AEC6FF]" />
            </a>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col lg:items-end gap-4">
            <p className="text-sm text-[#94A3B8] leading-relaxed lg:text-right max-w-sm">
              Built for Algerian universities, high schools, and self-learners. Publish video courses or start learning free.
            </p>
            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              <Link
                href="/sessions"
                className="inline-flex items-center h-11 px-5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-[13px] font-semibold text-white transition-colors"
              >
                Explore Catalog
              </Link>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#DDE3EC]/20 text-[13px] font-medium text-[#DDE3EC] hover:border-[#DDE3EC]/45 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied' : 'Copy email'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Brand + Sitemap Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-5">
            <BrandLogo size={30} />
            <p className="text-sm leading-relaxed text-[#94A3B8] max-w-sm">
              {SITE_CONFIG.description}
            </p>
            <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-mono text-emerald-300">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate whitespace-nowrap">All Systems Operational · 100% Free</span>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8"
          >
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow text-[#DDE3EC]">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#8A94A8] hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* 3. Bottom Bar */}
        <div className="py-6 border-t border-[#DDE3EC]/10 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#8A94A8]">
          <p>
            © {year} {SITE_CONFIG.name} · {SITE_CONFIG.country}
          </p>
          <p className="hidden lg:block font-mono text-[11px] uppercase tracking-widest text-[#7F97C7]">
            {SITE_CONFIG.institution}
          </p>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <InstallAppButton />
            <GitHubStarButton label="Star on GitHub" />
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex h-10 items-center gap-1.5 text-xs font-medium text-[#DDE3EC]/80 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
