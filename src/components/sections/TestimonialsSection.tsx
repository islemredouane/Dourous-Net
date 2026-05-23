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
    <div className="relative flex-shrink-0 w-[300px] rounded-2xl mx-3 group overflow-hidden bg-[#0a0d14]">
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 transition-all duration-500 group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-cyan-500/20"></div>
      
      <div className="relative z-10 h-full rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-3xl p-5 hover:border-white/[0.1] transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${learner.color} text-xs font-bold text-white shadow-lg`}>
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full border border-white/20"></div>
              {learner.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{learner.name}</p>
              <p className="text-xs text-indigo-200/60 leading-tight mt-0.5">{learner.handle}</p>
            </div>
          </div>
          <X className="h-4 w-4 text-slate-600 shrink-0 transition-colors group-hover:text-slate-400" />
        </div>

        {/* Text */}
        <p className="text-[14px] leading-relaxed text-slate-300">
          {learner.text}
        </p>
      </div>
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
