import { SectionTitle } from '@/components/shared/SectionTitle'

interface VoiceItem {
  readonly name: string
  readonly meta: string
  readonly avatar: string
  readonly track: string
  readonly text: string
}

const VOICES: readonly VoiceItem[] = [
  {
    name: 'Yasmine Hadj',
    meta: '2CP · Algiers',
    avatar: 'YH',
    track: 'Computer Science',
    text: 'Ordered video lessons, timed quizzes, and PDF homework in one workspace save me hours every week.',
  },
  {
    name: 'Karim Bensaid',
    meta: 'Instructor · USTHB',
    avatar: 'KB',
    track: 'Educator',
    text: 'Publishing a session and reviewing PDF submissions in one portal beats juggling Drive links and emails.',
  },
  {
    name: 'Nour El-Houda',
    meta: 'Engineering · Béjaïa',
    avatar: 'NE',
    track: 'Algorithms',
    text: 'The AI Learning Coach inside the lesson player helps clarify Big-O proofs right while watching.',
  },
  {
    name: 'Amine Zerrouki',
    meta: 'Lecturer · Oran',
    avatar: 'AZ',
    track: 'Physics',
    text: 'Timed MCQs with instant answer breakdowns let my students check their understanding right away.',
  },
  {
    name: 'Sara Mansouri',
    meta: 'Mathematics · Constantine',
    avatar: 'SM',
    track: 'Linear Algebra',
    text: 'I can pause a lecture on my phone and resume right where I left off on my laptop without losing progress.',
  },
  {
    name: 'Dr. Ahmed Benali',
    meta: 'Algorithms · ESTIN',
    avatar: 'AB',
    track: 'Educator',
    text: 'Real-time progress and structured assignment reviews in Teacher Studio transformed our weekly tutorials.',
  },
]

function VoiceCard({ learner }: { readonly learner: VoiceItem }) {
  return (
    <article className="rounded-xl border border-[#DDE3EC]/10 bg-[#0E1526] p-4 transition-colors hover:border-[#3B82F6]/35 hover:bg-[#121A2E]">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#3B82F6]/25 bg-[#1B2A55] font-mono text-[10px] font-bold text-[#AEC6FF]">
            {learner.avatar}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight text-white">
              {learner.name}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10.5px] text-[#7F97C7]">
              {learner.meta}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md border border-[#DDE3EC]/10 bg-[#0B1120] px-2 py-0.5 font-mono text-[10px] font-medium text-[#AEC6FF]">
          {learner.track}
        </span>
      </div>

      <p className="mt-3 text-[13px] leading-[1.55] text-[#CBD5E1]">
        {learner.text}
      </p>
    </article>
  )
}

export function TestimonialsSection() {
  return (
    <section className="bg-[#0B1120] py-16 sm:py-20 border-t border-[#DDE3EC]/10">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <SectionTitle
          eyebrow="04 · Campus Voices"
          title="Trusted by learners and educators."
          subtitle="Direct feedback from Algerian engineering students and university instructors."
          center={false}
          tone="dark"
          className="mb-8"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((learner) => (
            <VoiceCard key={learner.name} learner={learner} />
          ))}
        </div>
      </div>
    </section>
  )
}
