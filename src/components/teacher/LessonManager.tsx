'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, ExternalLink, Loader2, PlayCircle, Plus, Trash2, Video } from 'lucide-react'

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
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/,
  )
  return match ? match[1] : null
}

function isGoogleDrive(url: string): boolean {
  return url.includes('drive.google.com')
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
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const nextOrder =
        lessons.length > 0 ? Math.max(...lessons.map((l) => l.order_index)) + 1 : 0

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

      if (insertError) {
        setError(insertError.message)
        return
      }

      setLessons((prev) => [...prev, data as Lesson])
      setForm({ title: '', description: '', video_url: '', duration_minutes: '' })
      setShowForm(false)
    })
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    startTransition(async () => {
      const supabase = createClient()
      const { error: deleteError } = await supabase.from('lessons').delete().eq('id', id)
      if (deleteError) {
        setError(deleteError.message)
        setDeleteId(null)
        return
      }
      setLessons((prev) => prev.filter((l) => l.id !== id))
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-4">
      {lessons.length === 0 && !showForm && (
        <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-14 px-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D]">
            <Video className="h-5 w-5 text-[#60A5FA]" />
          </div>
          <p className="mb-1 text-base font-bold text-white">No lessons yet</p>
          <p className="mb-5 text-xs text-[#94A3B8]">
            Add your first lesson to start building the curriculum.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-xs font-semibold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Lesson</span>
          </button>
        </div>
      )}

      {lessons.length > 0 && (
        <div className="divide-y divide-[#DDE3EC]/10 rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
          {lessons.map((lesson, idx) => {
            const ytId = lesson.video_url ? getYouTubeId(lesson.video_url) : null
            return (
              <div key={lesson.id} className="flex items-start gap-4 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#1B2A55] font-mono text-xs font-bold text-[#AEC6FF]">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {ytId ? (
                  <img
                    src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                    alt={lesson.title}
                    className="h-14 w-24 shrink-0 rounded-lg object-cover border border-[#DDE3EC]/10"
                  />
                ) : (
                  <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-[#DDE3EC]/10 bg-[#080E1D]">
                    <PlayCircle
                      className={`h-5 w-5 ${
                        lesson.video_url && isGoogleDrive(lesson.video_url)
                          ? 'text-[#60A5FA]'
                          : 'text-[#8A94A8]'
                      }`}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{lesson.title}</p>
                  {lesson.description && (
                    <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">{lesson.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1.5 font-mono text-[11px] text-[#8A94A8]">
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
                        className="flex items-center gap-1 text-[#AEC6FF] hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> Source
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(lesson.id)}
                  disabled={deleteId === lesson.id}
                  aria-label="Delete lesson"
                  className="shrink-0 rounded-lg p-2 text-[#8A94A8] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  {deleteId === lesson.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-[#3B82F6]/35 bg-[#121A2E] p-6 space-y-4">
          <h3
            className="text-base font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            New Lesson
          </h3>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Introduction aux Algorithmes"
              className="h-10 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] text-sm focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Description (optional)</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What students will learn in this lesson"
              className="h-10 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] text-sm focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Video URL (YouTube, Google Drive, Vimeo, MP4)</Label>
            <Input
              value={form.video_url}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=... or Google Drive share link"
              className="h-10 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] text-sm focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Duration (minutes)</Label>
            <Input
              type="number"
              min={0}
              value={form.duration_minutes}
              onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
              placeholder="e.g. 30"
              className="h-10 w-36 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] text-sm focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError(null)
              }}
              className="h-10 rounded-full px-5 border border-[#DDE3EC]/15 text-[13px] font-medium text-[#DDE3EC] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isPending}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-[13px] font-semibold text-white transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Add Lesson
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {lessons.length > 0 && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#DDE3EC]/20 bg-[#121A2E]/60 py-3.5 text-xs font-semibold text-[#AEC6FF] hover:border-[#3B82F6] hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lesson</span>
        </button>
      )}
    </div>
  )
}
