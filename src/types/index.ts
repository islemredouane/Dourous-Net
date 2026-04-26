import type { Database } from './database'

export type Student = Database['public']['Tables']['students']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row']
export type Assignment = Database['public']['Tables']['assignments']['Row']
export type AssignmentSubmission = Database['public']['Tables']['assignment_submissions']['Row']

export type SessionWithTeacher = Session & {
  teacher: Student | null
}

export type EnrollmentWithSession = Enrollment & {
  session: SessionWithTeacher | null
}

export type LessonWithProgress = Lesson & { completed: boolean }

export type SessionWithCurriculum = SessionWithTeacher & {
  lessons: LessonWithProgress[]
  assignments: Assignment[]
}

export type Category =
  | 'General'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Computer Science'
  | 'Languages'
  | 'History'
  | 'Arts'
  | 'Other'

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  points: number
  explanation?: string
}
