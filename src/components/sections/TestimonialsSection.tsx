'use client'

import { X } from 'lucide-react'

const LEARNERS = [
  { handle: '@yasmine_hadj', name: 'Yasmine Hadj', avatar: 'YH', color: 'from-indigo-500 to-purple-600', text: 'The sessions are structured perfectly. Progress tracking keeps me motivated every day.' },
  { handle: '@karim_bensaid', name: 'Karim Bensaid', avatar: 'KB', color: 'from-emerald-500 to-teal-600', text: 'Creating sessions is effortless. I track all submissions without leaving the dashboard.' },
  { handle: '@nour_elhouda', name: 'Nour El-Houda', avatar: 'NE', color: 'from-pink-500 to-rose-600', text: 'Finally an Algerian platform that feels truly modern. The experience is incredibly smooth.' },
  { handle: '@amine_zerrouki', name: 'Amine Zerrouki', avatar: 'AZ', color: 'from-cyan-500 to-blue-600', text: 'My students engage so much more with video lessons. Dourous-Net made teaching joyful again.' },
  { handle: '@sara_mansouri', name: 'Sara Mansouri', avatar: 'SM', color: 'from-orange-500 to-amber-600', text: 'I love rewatching lessons at my own pace. The AI Coach is genuinely helpful.' },
  { handle: '@bilal_ouali', name: 'Bilal Ouali', avatar: 'BO', color: 'from-violet-500 to-purple-600', text: 'The quiz system with instant grading is fantastic. It helps me identify weak points fast.' },
  { handle: '@lina_cherif', name: 'Lina Cherif', avatar: 'LC', color: 'from-rose-500 to-pink-600', text: 'I use Dourous-Net every evening. The design is beautiful and super easy to navigate.' },
  { handle: '@rachid_hamdani', name: 'Rachid Hamdani', avatar: 'RH', color: 'from-sky-500 to-cyan-600', text: 'The platform helped me reach students I could never reach before. Truly transformative.' },
  { handle: '@meriem_ait', name: 'Meriem Aït', avatar: 'MA', color: 'from-fuchsia-500 to-violet-600', text: 'Watching the progress ring fill up as I complete lessons is deeply satisfying. Love it.' },
  { handle: '@youcef_tabet', name: 'Youcef Tabet', avatar: 'YT', color: 'from-green-500 to-emerald-600', text: 'Submitting assignments directly on the platform is so much easier than sending emails.' },
]

const ROW1 = [...LEARNERS.slice(0, 5), ...LEARNERS.slice(0, 5)]
const ROW2 = [...LEARNERS.slice(5), ...LEARNERS.slice(5)]

function TweetCard({ learner }: { learner: typeof LEARNERS[0] }) {
  return (
    <div className="flex-shrink-0 w-64 rounded-2xl border border-white/[0.08] bg-[#0d1117] p-4 mx-2.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${learner.color} text-[10px] font-bold text-white`}>
            {learner.avatar}
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-tight">{learner.name}</p>
            <p className="text-[11px] text-slate-500 leading-tight">{learner.handle}</p>
          </div>
        </div>
        <X className="h-3.5 w-3.5 text-slate-600 shrink-0" />
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed text-slate-400">
        {learner.text}
      </p>
    </div>
  )
}

function MarqueeRow({ items, reverse = false }: { items: typeof LEARNERS; reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex"
        style={{
          animation: `marquee${reverse ? '-reverse' : ''} 40s linear infinite`,
        }}
      >
        {items.map((learner, i) => (
          <TweetCard key={`${learner.handle}-${i}`} learner={learner} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
          Learners
        </p>
        <h2 className="text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Loved Across{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Algeria
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Join thousands of students and teachers who already trust Dourous-Net to learn and grow.
        </p>
      </div>

      <div className="space-y-3">
        <MarqueeRow items={ROW1} />
        <MarqueeRow items={ROW2} reverse />
      </div>
    </section>
  )
}
