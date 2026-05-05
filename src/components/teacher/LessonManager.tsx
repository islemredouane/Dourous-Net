'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus, Trash2, Loader2, PlayCircle, Clock, ExternalLink, Video
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  video_url: string | null
  duration_minutes: number
  order_index: number
}

interface LessonManagerProps {
  sessionId: string
  initialLessons: Lesson[]
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export function LessonManager({ sessionId, initialLessons }: LessonManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: '',
  })

  const handleAdd = () => {
    setError(null)
    if (!form.title.trim()) { setError('Title is required'); return }

    startTransition(async () => {
      const supabase = createClient()
      const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order_index)) + 1 : 0

      const { data, error: insertError } = await supabase
        .from('lessons')
        .insert({
          session_id: sessionId,
          title: form.title.trim(),
          description: form.description.trim() || null,
          video_url: form.video_url.trim() || null,
          duration_minutes: parseInt(form.duration_minutes) || 0,
          order_index: nextOrder,
        })
        .select()
        .single()

      if (insertError) { setError(insertError.message); return }

      setLessons(prev => [...prev, data as Lesson])
      setForm({ title: '', description: '', video_url: '', duration_minutes: '' })
      setShowForm(false)
    })
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    startTransition(async () => {
      const supabase = createClient()
      const { error: deleteError } = await supabase.from('lessons').delete().eq('id', id)
      if (deleteError) { setError(deleteError.message); setDeleteId(null); return }
      setLessons(prev => prev.filter(l => l.id !== id))
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-4">
      {/* Lesson list */}
      {lessons.length === 0 && !showForm && (
        <GlassCard className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
            🎬
          </div>
          <p className="mb-1 text-base font-semibold text-white">No lessons yet</p>
          <p className="mb-5 text-sm text-slate-500">Add your first lesson to build the curriculum.</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Lesson
          </Button>
        </GlassCard>
      )}

      {lessons.map((lesson, idx) => {
        const ytId = lesson.video_url ? getYouTubeId(lesson.video_url) : null
        return (
          <GlassCard key={lesson.id} className="flex items-start gap-4 p-4">
            {/* Order badge */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400">
              {idx + 1}
            </div>

            {/* Thumbnail preview */}
            {ytId && (
              <img
                src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                alt={lesson.title}
                className="h-14 w-24 shrink-0 rounded-lg object-cover border border-white/5"
              />
            )}
            {!ytId && (
              <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5">
                <PlayCircle className="h-6 w-6 text-slate-600" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{lesson.title}</p>
              {lesson.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lesson.description}</p>
              )}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                {lesson.duration_minutes > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lesson.duration_minutes} min
                  </span>
                )}
                {lesson.video_url && (
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" /> Watch
                  </a>
                )}
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(lesson.id)}
              disabled={deleteId === lesson.id}
              className="shrink-0 rounded-lg p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
            >
              {deleteId === lesson.id
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Trash2 className="h-4 w-4" />
              }
            </button>
          </GlassCard>
        )
      })}

      {/* Add lesson form */}
      {showForm && (
        <GlassCard className="space-y-4 border border-indigo-500/20">
          <h3 className="text-sm font-semibold text-white">New Lesson</h3>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Title *</Label>
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Introduction aux Algorithmes"
              className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Description <span className="text-slate-600">(optional)</span></Label>
            <Input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What students will learn in this lesson"
              className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400 flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-red-400" />
              Video URL <span className="text-slate-600">(YouTube or Vimeo link)</span>
            </Label>
            <Input
              value={form.video_url}
              onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 text-sm"
            />
            <p className="text-[11px] text-slate-600">
              Paste any YouTube or Vimeo link — students will watch it directly in the lesson player.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Duration (minutes)</Label>
            <Input
              type="number"
              min={0}
              value={form.duration_minutes}
              onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
              placeholder="e.g. 30"
              className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 text-sm w-32"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setShowForm(false); setError(null) }}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={isPending}
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {isPending
                ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Saving…</>
                : <><Plus className="mr-1.5 h-3.5 w-3.5" />Add Lesson</>
              }
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Add lesson button (when list is not empty) */}
      {lessons.length > 0 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-500/20 py-3 text-sm text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Lesson
        </button>
      )}
    </div>
  )
}
