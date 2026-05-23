import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner className="scale-150" />
    </div>
  )
}
