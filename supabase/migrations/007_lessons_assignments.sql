-- Lessons (video curriculum per session)
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  video_url text,
  order_index int NOT NULL DEFAULT 0,
  duration_minutes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lessons_session_id_idx ON public.lessons(session_id);
CREATE INDEX IF NOT EXISTS lessons_order_idx ON public.lessons(session_id, order_index);

-- Per-student per-lesson completion
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(student_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS lesson_progress_student_idx ON public.lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS lesson_progress_lesson_idx ON public.lesson_progress(lesson_id);

-- Assignments/quizzes per session
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- questions format: [{ id, question, options: string[], correct_index: number, points: number, explanation?: string }]
  total_points int DEFAULT 0,
  time_limit_minutes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Student quiz submissions with instant grading
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- answers format: [{ question_id: string, selected_index: number }]
  score int DEFAULT 0,
  total_points int DEFAULT 0,
  percentage numeric(5,2) DEFAULT 0,
  graded_at timestamptz DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- lessons: public read, teacher write
CREATE POLICY "lessons_select_public" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "lessons_insert_teacher" ON public.lessons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = lessons.session_id AND s.teacher_id = auth.uid())
);
CREATE POLICY "lessons_update_teacher" ON public.lessons FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = lessons.session_id AND s.teacher_id = auth.uid())
);
CREATE POLICY "lessons_delete_teacher" ON public.lessons FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = lessons.session_id AND s.teacher_id = auth.uid())
);

-- lesson_progress: student owns their rows
CREATE POLICY "lesson_progress_select_own" ON public.lesson_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "lesson_progress_insert_own" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "lesson_progress_update_own" ON public.lesson_progress FOR UPDATE USING (auth.uid() = student_id);

-- assignments: public read, teacher write
CREATE POLICY "assignments_select_public" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "assignments_insert_teacher" ON public.assignments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = assignments.session_id AND s.teacher_id = auth.uid())
);
CREATE POLICY "assignments_update_teacher" ON public.assignments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = assignments.session_id AND s.teacher_id = auth.uid())
);

-- assignment_submissions: student owns their rows
CREATE POLICY "submissions_select_own" ON public.assignment_submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "submissions_insert_own" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
-- Teachers can see submissions for their sessions
CREATE POLICY "submissions_select_teacher" ON public.assignment_submissions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.sessions s ON s.id = a.session_id
    WHERE a.id = assignment_submissions.assignment_id AND s.teacher_id = auth.uid()
  )
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- 4 lessons for session 1: "Algorithmes et Structures de Données"
INSERT INTO public.lessons (id, session_id, title, description, video_url, order_index, duration_minutes)
VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Introduction aux Algorithmes',
    'Découvrez les fondements des algorithmes : complexité temporelle, notation Big-O, et analyse des performances.',
    'https://www.youtube.com/watch?v=HtSuA80QTyo',
    0,
    32
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Tableaux et Listes Chaînées',
    'Comparaison entre tableaux statiques et listes chaînées simples/doubles. Implémentation et cas d''usage.',
    'https://www.youtube.com/watch?v=RBSGKlAvoiM',
    1,
    45
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Piles, Files et Arbres',
    'Structures de données hiérarchiques : pile LIFO, file FIFO, arbres binaires et arbres de recherche (BST).',
    'https://www.youtube.com/watch?v=09_LlHjoEiY',
    2,
    51
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000001',
    'Algorithmes de Tri',
    'Tri par insertion, tri rapide (quicksort) et tri fusion (mergesort) : fonctionnement, complexité et comparaison pratique.',
    'https://www.youtube.com/watch?v=kgBjXUE_Nwc',
    3,
    58
  )
ON CONFLICT DO NOTHING;

-- 1 assignment (quiz) for session 1
INSERT INTO public.assignments (id, session_id, title, description, questions, total_points, time_limit_minutes)
VALUES
  (
    'c0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Quiz : Algorithmes et Structures de Données',
    'Évaluez vos connaissances sur les algorithmes et les structures de données vus en cours.',
    '[
      {
        "id": "q1",
        "question": "Quelle est la complexité temporelle dans le pire cas de l''algorithme QuickSort ?",
        "options": ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        "correct_index": 1,
        "points": 25,
        "explanation": "Dans le pire cas (tableau déjà trié et pivot toujours le dernier élément), QuickSort atteint O(n²). En moyenne il est O(n log n)."
      },
      {
        "id": "q2",
        "question": "Quelle structure de données suit le principe LIFO (Last In, First Out) ?",
        "options": ["File (Queue)", "Tableau", "Pile (Stack)", "Liste chaînée"],
        "correct_index": 2,
        "points": 25,
        "explanation": "La pile (Stack) suit le principe LIFO : le dernier élément inséré est le premier à être retiré."
      },
      {
        "id": "q3",
        "question": "Dans un arbre binaire de recherche (BST) équilibré contenant n éléments, quelle est la complexité de la recherche ?",
        "options": ["O(n)", "O(n²)", "O(1)", "O(log n)"],
        "correct_index": 3,
        "points": 25,
        "explanation": "Un BST équilibré divise l''espace de recherche par deux à chaque étape, ce qui donne O(log n)."
      },
      {
        "id": "q4",
        "question": "Quelle notation décrit le comportement d''un algorithme dans le pire cas ?",
        "options": ["Notation Omega (Ω)", "Notation Theta (Θ)", "Notation Big-O (O)", "Notation Sigma (Σ)"],
        "correct_index": 2,
        "points": 25,
        "explanation": "La notation Big-O (O) représente une borne supérieure sur le temps d''exécution, c''est-à-dire le pire cas."
      }
    ]'::jsonb,
    100,
    20
  )
ON CONFLICT DO NOTHING;
