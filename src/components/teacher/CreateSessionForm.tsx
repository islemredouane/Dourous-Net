'use client'

import { useRef, useState } from 'react'
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
import { Loader2, BookOpen, Upload, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Pick a category'),
  duration_hours: z.number({ error: 'Enter a valid number' }).min(1, 'At least 1 hour').max(200),
  is_free: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface CreateSessionFormProps {
  readonly teacherId: string
}

export function CreateSessionForm({ teacherId }: CreateSessionFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const supabase = createClient()

    let thumbnail_url: string | null = null

    // Upload thumbnail if selected
    if (thumbnailFile) {
      setUploading(true)
      const ext = thumbnailFile.name.split('.').pop()
      const fileName = `${teacherId}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, thumbnailFile, { upsert: true })

      setUploading(false)

      if (uploadError) {
        setServerError('Failed to upload thumbnail: ' + uploadError.message)
        return
      }

      const { data: urlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName)
      thumbnail_url = urlData.publicUrl
    }

    const { error } = await supabase.from('sessions').insert({
      teacher_id: teacherId,
      title: data.title,
      description: data.description,
      category: data.category,
      duration_hours: data.duration_hours,
      is_free: data.is_free,
      thumbnail_url,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    router.push('/teacher')
    router.refresh()
  }

  const categories = CATEGORIES.filter((c) => c.value !== 'all')
  const isLoading = isSubmitting || uploading

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

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <Label className="text-slate-300">
            Thumbnail <span className="text-slate-600">(optional)</span>
          </Label>

          {thumbnailPreview ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-indigo-500/20 group">
              <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-500/30 bg-white/3 px-4 py-8 text-slate-500 hover:border-indigo-500/60 hover:text-slate-300 hover:bg-white/5 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                <ImageIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-300">Click to upload thumbnail</p>
                <p className="text-xs text-slate-600 mt-0.5">JPG, PNG, WebP — max 10 MB</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5">
                <Upload className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-400">Choose file</span>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
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
            disabled={isLoading}
            className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{uploading ? 'Uploading…' : 'Publishing…'}</>
            ) : (
              <><BookOpen className="mr-2 h-4 w-4" />Publish Session</>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
