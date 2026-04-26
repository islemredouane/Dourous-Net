'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CATEGORIES } from '@/lib/constants'
import { Loader2, BookOpen } from 'lucide-react'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Pick a category'),
  duration_hours: z.number({ error: 'Enter a valid number' }).min(1, 'At least 1 hour').max(200),
  thumbnail_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  is_free: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface CreateSessionFormProps {
  readonly teacherId: string
}

export function CreateSessionForm({ teacherId }: CreateSessionFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'Computer Science', is_free: true, duration_hours: 4 },
  })

  const isFree = watch('is_free')

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.from('sessions').insert({
      teacher_id: teacherId,
      title: data.title,
      description: data.description,
      category: data.category,
      duration_hours: data.duration_hours,
      is_free: data.is_free,
      thumbnail_url: data.thumbnail_url || null,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    router.push('/teacher')
    router.refresh()
  }

  const categories = CATEGORIES.filter((c) => c.value !== 'all')

  return (
    <GlassCard className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-slate-300">Session Title *</Label>
          <Input
            {...register('title')}
            placeholder="e.g. Algorithmes et Structures de Données"
            className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-slate-300">Description *</Label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Describe what students will learn, prerequisites, and course structure…"
            className="w-full rounded-lg bg-white/5 border border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-3 py-2 text-sm resize-none"
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
        </div>

        {/* Category + Duration row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Category *</Label>
            <select
              {...register('category')}
              className="w-full rounded-lg bg-white/5 border border-indigo-500/20 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Duration (hours) *</Label>
            <Input
              type="number"
              min={1}
              max={200}
              {...register('duration_hours', { valueAsNumber: true })}
              placeholder="e.g. 12"
              className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
            />
            {errors.duration_hours && <p className="text-xs text-red-400">{errors.duration_hours.message}</p>}
          </div>
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-2">
          <Label className="text-slate-300">Thumbnail URL <span className="text-slate-600">(optional)</span></Label>
          <Input
            {...register('thumbnail_url')}
            placeholder="https://example.com/image.jpg"
            className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
          />
          {errors.thumbnail_url && <p className="text-xs text-red-400">{errors.thumbnail_url.message}</p>}
        </div>

        {/* Free toggle */}
        <div className="flex items-center justify-between rounded-xl border border-indigo-500/10 bg-white/3 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Free session</p>
            <p className="text-xs text-slate-500">Make this session available at no cost</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isFree}
            onClick={() => setValue('is_free', !isFree)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isFree ? 'bg-indigo-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isFree ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
            {serverError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/teacher')}
            className="flex-1 text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Publishing…</>
            ) : (
              <><BookOpen className="mr-2 h-4 w-4" />Publish Session</>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
