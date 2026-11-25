import { SectionTitle } from '@/components/shared/SectionTitle'
import { Plus } from 'lucide-react'

const FAQS = [
  {
    q: 'Is Dourous-Net completely free for students?',
    a: 'Yes. Creating an account, enrolling in open sessions, watching video lessons, taking timed quizzes, uploading assignments, and asking the AI Learning Coach are free for all learners.',
  },
  {
    q: 'How can teachers publish courses and quizzes?',
    a: 'Select the Teacher role during onboarding (or sign in with an educator account), then open the Teacher Studio from the top bar. You can publish sessions, add ordered video lessons, build timed MCQs with explanations, and inspect student PDF submissions.',
  },
  {
    q: 'Which video hosts work in the lesson player?',
    a: 'Teachers can paste standard YouTube links (watch, youtu.be, shorts, or embed), Google Drive shared video links, Vimeo links, or direct MP4 URLs. Everything renders seamlessly inside the workspace player.',
  },
  {
    q: 'How does the AI Learning Coach help during lessons?',
    a: 'Inside every lesson workspace, the AI Learning Coach knows your course title, category, and syllabus context, helping you unpack difficult concepts, formulas, or code examples without leaving the player.',
  },
  {
    q: 'How are student assignments and scores protected?',
    a: 'Dourous-Net runs on PostgreSQL with Supabase Row-Level Security (RLS). Students can only read and modify their own enrollments, progress, and private submission files, while teachers only access submissions belonging to their own courses.',
  },
]

export function FaqSection() {
  return (
    <section className="bg-white text-[#0B1120] py-20 sm:py-28 border-t border-[#1B2A55]/10">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <SectionTitle
            eyebrow="05 · FAQ"
            title="Questions, answered."
            subtitle="Everything students and instructors ask before getting started."
            center={false}
            tone="light"
            className="mb-0 lg:sticky lg:top-28"
          />
        </div>

        <div className="lg:col-span-8 divide-y divide-[#1B2A55]/12 border-y border-[#1B2A55]/12">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              className="group py-2"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-xs text-[#7F97C7]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="flex-1 text-xl font-bold text-[#0B1120] group-hover:text-[#2563EB] transition-colors md:text-2xl"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {item.q}
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#1B2A55]/15 text-[#0B1120] transition group-open:rotate-45 group-open:border-[#0B1120] group-open:bg-[#0B1120] group-open:text-white">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pl-9 sm:pl-10 text-[16.5px] leading-relaxed text-[#3A4458]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
