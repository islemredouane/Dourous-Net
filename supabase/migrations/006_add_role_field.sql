-- Migration 006: Add role, field, and onboarded columns to public.students

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'teacher'));

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS field text;

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;

-- Mark seed teachers as onboarded with their respective fields
UPDATE public.students SET role = 'teacher', onboarded = true, field = 'Computer Science'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

UPDATE public.students SET role = 'teacher', onboarded = true, field = 'Mathematics'
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

UPDATE public.students SET role = 'teacher', onboarded = true, field = 'Languages'
WHERE id = 'c3d4e5f6-a7b8-9012-cdef-123456789012';
