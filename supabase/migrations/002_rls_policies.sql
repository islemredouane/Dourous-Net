-- ============================================================
-- ROW-LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.students    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STUDENTS policies
-- ============================================================

-- Anyone can view student profiles (needed for teacher joins)
CREATE POLICY "students_select_public"
  ON public.students FOR SELECT
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "students_insert_own"
  ON public.students FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "students_update_own"
  ON public.students FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- SESSIONS policies
-- ============================================================

-- Anyone can view sessions
CREATE POLICY "sessions_select_public"
  ON public.sessions FOR SELECT
  USING (true);

-- Only authenticated teachers can create sessions
CREATE POLICY "sessions_insert_teacher"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can only update their own sessions
CREATE POLICY "sessions_update_own"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can only delete their own sessions
CREATE POLICY "sessions_delete_own"
  ON public.sessions FOR DELETE
  USING (auth.uid() = teacher_id);

-- ============================================================
-- ENROLLMENTS policies
-- ============================================================

-- Students can only view their own enrollments
CREATE POLICY "enrollments_select_own"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can view enrollments for their sessions
CREATE POLICY "enrollments_select_teacher"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = enrollments.session_id
        AND s.teacher_id = auth.uid()
    )
  );

-- Authenticated students can enroll in sessions
CREATE POLICY "enrollments_insert_own"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own enrollment (progress, submission)
CREATE POLICY "enrollments_update_own"
  ON public.enrollments FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Students can withdraw from sessions
CREATE POLICY "enrollments_delete_own"
  ON public.enrollments FOR DELETE
  USING (auth.uid() = student_id);
