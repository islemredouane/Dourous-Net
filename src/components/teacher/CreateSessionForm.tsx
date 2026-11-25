'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CustomSelect } from '@/components/ui/custom-select'
import { CATEGORIES } from '@/lib/constants'
import { BookOpen, ImageIcon, Loader2, Upload, X } from 'lucide-react'
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

    const { data: inserted, error } = await supabase
      .from('sessions')
      .insert({
        teacher_id: teacherId,
        title: data.title,
        description: data.description,
        category: data.category,
        duration_hours: data.duration_hours,
        is_free: data.is_free,
        thumbnail_url,
      })
      .select('id')
      .single()

    if (error) {
      setServerError(error.message)
      return
    }

    router.push(`/teacher/sessions/${inserted.id}/lessons`)
    router.refresh()
  }

  const categories = CATEGORIES.filter((c) => c.value !== 'all')
  const isLoading = isSubmitting || uploading

  return (
    <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 sm:p-7">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label className="eyebrow text-[#8A94A8]">Session Title *</Label>
          <Input
            {...register('title')}
            placeholder="e.g. Algorithmes et Structures de Données"
            className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="eyebrow text-[#8A94A8]">Description *</Label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Describe what students will learn, prerequisites, and course structure…"
            className="w-full rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus:border-[#3B82F6] focus:outline-none px-3.5 py-3 text-sm resize-none"
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Discipline *</Label>
            <CustomSelect
              ariaLabel="Discipline"
              value={watch('category')}
              onChange={(val) => setValue('category', val, { shouldValidate: true })}
              triggerClassName="h-11 text-sm text-white"
              options={categories.map((cat) => ({
                value: cat.value,
                label: cat.label,
              }))}
            />
            {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="eyebrow text-[#8A94A8]">Duration (hours) *</Label>
            <Input
              type="number"
              min={1}
              max={200}
              {...register('duration_hours', { valueAsNumber: true })}
              placeholder="e.g. 12"
              className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
            />
            {errors.duration_hours && (
              <p className="text-xs text-red-400">{errors.duration_hours.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="eyebrow text-[#8A94A8]">
            Thumbnail <span className="normal-case text-[#8A94A8]">(optional)</span>
          </Label>

          {thumbnailPreview ? (
            <div className="relative w-full h-44 overflow-hidden rounded-xl border border-[#DDE3EC]/15 group">
              <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1120]/80 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#DDE3EC]/20 bg-[#080E1D] px-4 py-8 text-[#94A3B8] hover:border-[#3B82F6] hover:text-white transition-colors"
            >
              <ImageIcon className="h-6 w-6 text-[#60A5FA]" />
              <p className="text-xs font-medium text-white">Click to upload thumbnail</p>
              <p className="font-mono text-[11px] text-[#8A94A8]">JPG, PNG, WebP — max 10 MB</p>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE3EC]/15 bg-[#121A2E] px-3 py-1 text-xs text-[#AEC6FF]">
                <Upload className="h-3.5 w-3.5" /> Choose file
              </span>
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

        <div className="flex items-center justify-between rounded-xl border border-[#DDE3EC]/10 bg-[#080E1D] px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-white">Free Open Enrollment</p>
            <p className="text-xs text-[#8A94A8]">Allow all students to enroll at no cost</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isFree}
            onClick={() => setValue('is_free', !isFree)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFree ? 'bg-[#2563EB]' : 'bg-[#1B2A55]'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full transform bg-white transition-transform ${isFree ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {serverError && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {serverError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/teacher')}
            className="flex-1 h-11 rounded-full border border-[#DDE3EC]/15 text-xs font-medium text-[#DDE3EC] hover:border-white hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{uploading ? 'Uploading...' : 'Publishing...'}</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                <span>Publish Session</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
