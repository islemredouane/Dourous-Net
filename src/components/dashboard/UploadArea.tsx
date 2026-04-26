'use client'

import { useCallback, useState } from 'react'
import { useUpload } from '@/hooks/useUpload'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
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
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>(
    enrollments[0]?.id ?? '',
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

    const { url, error: uploadError } = await upload(selectedFile, 'submissions', studentId)

    if (uploadError || !url) {
      setError(uploadError?.message ?? 'Upload failed')
      return
    }

    setUploadedUrl(url)

    if (selectedEnrollmentId) {
      const supabase = createClient()
      await supabase
        .from('enrollments')
        .update({ submission_url: url, status: 'in_progress' as const, progress: 50 })
        .eq('id', selectedEnrollmentId)
    }

    setSelectedFile(null)
  }

  const activeEnrollments = enrollments.filter((e) => e.status !== 'completed')

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <CloudUpload className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Submit Assignment
          </h3>
          <p className="text-xs text-slate-500">Upload your work — max 50 MB</p>
        </div>
      </div>

      {/* Session selector */}
      {activeEnrollments.length === 0 ? (
        <p className="rounded-xl border border-slate-700 bg-white/3 px-4 py-3 text-sm text-slate-500 text-center">
          Enroll in a session to submit assignments.
        </p>
      ) : (
        <>
          {activeEnrollments.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Submit for session</label>
              <select
                value={selectedEnrollmentId}
                onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-indigo-500/20 text-white text-sm focus:border-indigo-500 focus:outline-none px-3 py-2"
              >
                {activeEnrollments.map((e) => (
                  <option key={e.id} value={e.id} className="bg-slate-900 text-white">
                    {e.session?.title ?? e.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer ${
              dragOver
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-slate-700 hover:border-indigo-500/50 hover:bg-white/5'
            }`}
            onClick={() => document.getElementById('file-upload')?.click()}
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
                <File className="h-8 w-8 text-indigo-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  className="ml-2 text-slate-500 hover:text-red-400"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <CloudUpload className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                <p className="text-sm text-slate-400">
                  Drag & drop a file here, or{' '}
                  <span className="text-indigo-400">click to browse</span>
                </p>
                <p className="mt-1 text-xs text-slate-600">PDF, DOC, ZIP, images — up to 50 MB</p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {uploadedUrl && (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Assignment uploaded successfully!
            </div>
          )}

          {selectedFile && !uploadedUrl && (
            <Button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {uploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
              ) : (
                <><CloudUpload className="mr-2 h-4 w-4" />Submit Assignment</>
              )}
            </Button>
          )}
        </>
      )}
    </GlassCard>
  )
}
