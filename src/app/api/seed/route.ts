import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Ensure user is a teacher
  await supabase
    .from('students')
    .update({ role: 'teacher', onboarded: true })
    .eq('id', user.id)

  // Seed sessions
  const sessions = [
    {
      teacher_id: user.id,
      title: 'Introduction to Calculus',
      description: 'A beginner-friendly guide to limits, derivatives, and integrals.',
      category: 'Mathematics',
      duration_hours: 10,
      is_free: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    },
    {
      teacher_id: user.id,
      title: 'Advanced React Patterns',
      description: 'Master React by learning about HOCs, Render Props, and Custom Hooks.',
      category: 'Computer Science',
      duration_hours: 5,
      is_free: false,
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    },
    {
      teacher_id: user.id,
      title: 'Quantum Physics Basics',
      description: 'Dive into the fascinating world of quantum mechanics.',
      category: 'Physics',
      duration_hours: 8,
      is_free: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop',
    }
  ]

  const { data: insertedSessions, error } = await supabase
    .from('sessions')
    .insert(sessions)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, sessions: insertedSessions })
}
