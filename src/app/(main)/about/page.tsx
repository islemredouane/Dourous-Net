import { SectionTitle } from '@/components/shared/SectionTitle'
import { AboutCta } from '@/components/about/AboutCta'
import { Cloud, Database, Layers, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'How It Works & Architecture',
  description:
    'Learn how Dourous-Net connects Algerian students and teachers through Next.js App Router, Supabase PostgreSQL RLS, and AI tutoring.',
}

const STEPS = [
  {
    num: '01',
    title: 'Discover & Enroll',
    text: 'Browse courses across six core disciplines, inspect full lesson syllabi and instructor dossiers, and enroll in one click.',
  },
  {
    num: '02',
    title: 'Watch & Ask AI Coach',
    text: 'Stream YouTube, Google Drive, or Vimeo lessons in a distraction-free workspace while asking course-scoped questions to the AI Coach.',
  },
  {
    num: '03',
    title: 'Assess & Submit Work',
    text: 'Take timed MCQs with instant grading and answer explanations, or upload PDF homework directly to private cloud storage.',
  },
  {
    num: '04',
    title: 'Publish as Educator',
    text: 'Teachers create sessions, sequence video lessons, author quizzes, and review student submissions in one Teacher Studio.',
  },
]

const STACK = [
  {
    icon: Layers,
    name: 'Next.js 16 App Router',
    detail: 'Server Components, partitioned Route Groups (main, workspace, auth), and edge-ready request Proxy protection.',
  },
  {
    icon: Database,
    name: 'Supabase PostgreSQL + RLS',
    detail: 'Structured relational schema (students, sessions, enrollments, lessons, assignments) enforced by Row-Level Security.',
  },
  {
    icon: Cloud,
    name: 'Supabase Object Storage',
    detail: 'Dedicated CDN buckets for course thumbnails, user avatars, and private student PDF assignment submissions.',
  },
  {
    icon: Sparkles,
    name: 'Groq Cloud AI Coach',
    detail: 'Low-latency contextual tutoring grounded in each course title, category, and description via server API routes.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Dark Header */}
      <section className="relative bg-[#0B1120] pt-32 pb-20 border-b border-[#DDE3EC]/10 overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-10">
          <p className="eyebrow text-[#7F97C7] mb-3">Platform Blueprint · ISI 2CP Theme 4</p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.06]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Built to make structured learning accessible across Algeria.
          </h1>
          <p
            className="mt-6 max-w-2xl border-l-2 border-[#2563EB] pl-5 text-lg italic text-[#DDE3EC]/80"
            style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
          >
            &ldquo;From classroom lectures to interactive self-paced mastery — engineered with cloud scalability and academic rigor.&rdquo;
          </p>
        </div>
      </section>

      {/* Light Editorial Section: Workflow */}
      <section className="bg-[#F5F6F8] text-[#0B1120] py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-10">
          <SectionTitle
            eyebrow="01 · Learning & Teaching Flow"
            title="Four steps from enrollment to mastery."
            center={false}
            tone="light"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden bg-[#1B2A55]/12 border border-[#1B2A55]/12 shadow-sm">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white p-7 flex flex-col">
                <span className="font-mono text-lg font-bold text-[#2563EB]">{step.num}</span>
                <h2
                  className="mt-4 text-xl font-bold text-[#0B1120]"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {step.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[#3A4458]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Section: Cloud & Data Architecture */}
      <section className="bg-[#0B1120] py-20 sm:py-24 border-t border-[#DDE3EC]/10">
        <div className="mx-auto max-w-[1240px] px-5 md:px-10">
          <SectionTitle
            eyebrow="02 · Cloud Architecture"
            title="OPEX cloud infrastructure built to scale."
            subtitle="Structured PostgreSQL relations paired with object storage and serverless compute."
            center={false}
            tone="dark"
          />

          <div className="grid md:grid-cols-2 gap-5">
            {STACK.map(({ icon: Icon, name, detail }) => (
              <div
                key={name}
                className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-7 flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#2563EB]/15 text-[#AEC6FF]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#94A3B8]">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <AboutCta />
        </div>
      </section>
    </div>
  )
}
