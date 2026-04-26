-- ============================================================
-- AUTH TRIGGER — Auto-create student profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.students (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger fires after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA — Sample sessions for demo purposes
-- (Run after creating a teacher account and replacing UUIDs)
-- ============================================================

-- Uncomment and replace {TEACHER_UUID} with a real student ID:
/*
INSERT INTO public.sessions (teacher_id, title, description, category, duration_hours, is_free)
VALUES
  ('{TEACHER_UUID}', 'Introduction to Algebra', 'Master the fundamentals of algebra with step-by-step exercises.', 'Mathematics', 8, true),
  ('{TEACHER_UUID}', 'Python for Beginners', 'Learn Python from scratch — variables, loops, functions, and more.', 'Computer Science', 12, true),
  ('{TEACHER_UUID}', 'French Grammar Essentials', 'Build a solid foundation in French grammar and vocabulary.', 'Languages', 6, false),
  ('{TEACHER_UUID}', 'Physics: Mechanics', 'Newton''s laws, kinematics, and dynamics explained simply.', 'Physics', 10, true),
  ('{TEACHER_UUID}', 'World History: 20th Century', 'Key events that shaped the modern world, from WWI to the Cold War.', 'History', 8, false),
  ('{TEACHER_UUID}', 'Digital Art Fundamentals', 'Composition, color theory, and digital painting techniques.', 'Arts', 5, true);
*/
