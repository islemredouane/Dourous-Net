-- ============================================================
-- DOUROUS-NET — ISI 2CP 2026, Theme 4: Education
-- Table A: students (Users)
-- Table B: sessions (Resources/Courses)
-- Table C: enrollments (Interactions)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE A — students (Users / Auth entity)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text UNIQUE NOT NULL,
  full_name    text NOT NULL DEFAULT '',
  avatar_url   text,
  level        text NOT NULL DEFAULT 'Beginner'
                CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  bio          text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.students IS 'Platform users — both learners and teachers.';

-- ============================================================
-- TABLE B — sessions (Resources / Course entity)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id     uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title          text NOT NULL,
  description    text,
  category       text NOT NULL DEFAULT 'General'
                 CHECK (category IN (
                   'General', 'Mathematics', 'Physics', 'Chemistry',
                   'Computer Science', 'Languages', 'History', 'Arts', 'Other'
                 )),
  thumbnail_url  text,
  duration_hours int  NOT NULL DEFAULT 0 CHECK (duration_hours >= 0),
  is_free        boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sessions IS 'Educational sessions / courses created by teachers.';

CREATE INDEX idx_sessions_teacher_id ON public.sessions(teacher_id);
CREATE INDEX idx_sessions_category   ON public.sessions(category);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at DESC);

-- ============================================================
-- TABLE C — enrollments (Interactions / Relationship entity)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  session_id     uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  status         text NOT NULL DEFAULT 'enrolled'
                 CHECK (status IN ('enrolled', 'in_progress', 'completed')),
  progress       int  NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  submission_url text,
  enrolled_at    timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  UNIQUE(student_id, session_id)
);

COMMENT ON TABLE public.enrollments IS 'Student enrollment in sessions — tracks progress and submissions.';

CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_session_id ON public.enrollments(session_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
