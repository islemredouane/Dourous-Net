'use client'

import { useCallback, useState } from 'react'
import { useUpload } from '@/hooks/useUpload'
import { createClient } from '@/lib/supabase/client'
import { CustomSelect } from '@/components/ui/custom-select'
import { CheckCircle, CloudUpload, File, Loader2, X } from 'lucide-react'
import type { EnrollmentWithSession } from '@/types'

interface UploadAreaProps {
  readonly studentId: string
  readonly enrollments: EnrollmentWithSession[]
}

export function UploadArea({ studentId, enrollments }: UploadAreaProps) {
  const { upload, uploading } = useUpload()
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeEnrollments = enrollments.filter((e) => e.status !== 'completed')
  const selectable = activeEnrollments.length > 0 ? activeEnrollments : enrollments
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>(
    selectable[0]?.id ?? '',
  )

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file)
    setUploadedUrl(null)
    setError(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleSubmit = async () => {
    if (!selectedFile) return
    setError(null)

    const { url, error: uploadError } = await upload(
      selectedFile,
      'submissions',
      studentId,
    )

    if (uploadError || !url) {
      setError(uploadError?.message ?? 'Upload failed')
      return
    }

    setUploadedUrl(url)

    const target = enrollments.find((e) => e.id === selectedEnrollmentId)
    if (selectedEnrollmentId && target) {
      const supabase = createClient()
      const nextProgress = Math.max(target.progress ?? 0, 50)
      const nextStatus =
        target.status === 'completed'
          ? ('completed' as const)
          : ('in_progress' as const)

      await supabase
        .from('enrollments')
        .update({
          submission_url: url,
          status: nextStatus,
          progress: nextProgress,
        })
        .eq('id', selectedEnrollmentId)
    }

    setSelectedFile(null)
  }

  return (
    <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-6 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-[#DDE3EC]/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#2563EB]/15">
          <CloudUpload className="h-5 w-5 text-[#AEC6FF]" />
        </div>
        <div>
          <h3
            className="text-base font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Submit Assignment
          </h3>
          <p className="font-mono text-[11px] text-[#8A94A8]">PDF / DOC / ZIP · Max 50 MB</p>
        </div>
      </div>

      {selectable.length === 0 ? (
        <p className="rounded-xl border border-[#DDE3EC]/10 bg-[#080E1D] px-4 py-4 text-xs text-[#94A3B8] text-center">
          Enroll in a session first to submit assignments.
        </p>
      ) : (
        <>
          <div className="space-y-1.5">
            <label
              htmlFor="assignment-session"
              className="eyebrow text-[#8A94A8] block"
            >
              Target Session
            </label>
            <CustomSelect
              id="assignment-session"
              ariaLabel="Target Session"
              value={selectedEnrollmentId}
              onChange={setSelectedEnrollmentId}
              triggerClassName="h-10 text-xs text-white"
              options={selectable.map((e) => ({
                value: e.id,
                label: e.session?.title ?? e.id,
              }))}
            />
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
            className={`rounded-xl border border-dashed p-6 text-center transition-colors cursor-pointer ${dragOver
              ? 'border-[#3B82F6] bg-[#2563EB]/10'
              : 'border-[#DDE3EC]/20 bg-[#080E1D] hover:border-[#3B82F6]/60'
              }`}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <File className="h-7 w-7 text-[#60A5FA] shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="font-mono text-[11px] text-[#8A94A8]">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                  }}
                  aria-label="Remove file"
                  className="ml-2 text-[#8A94A8] hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <CloudUpload className="mx-auto mb-2.5 h-8 w-8 text-[#7F97C7]" />
                <p className="text-xs text-[#DDE3EC]">
                  Drop your file here or <span className="text-[#AEC6FF] underline">browse</span>
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {uploadedUrl && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Assignment uploaded to your instructor.</span>
            </div>
          )}

          {selectedFile && !uploadedUrl && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4" /> Submit Assignment
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  )
}
