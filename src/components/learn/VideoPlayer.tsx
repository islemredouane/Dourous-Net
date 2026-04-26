'use client'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] ?? null
}

interface VideoPlayerProps {
  url: string
  title: string
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const ytId = getYouTubeId(url)

  if (ytId) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-glow-sm"
        style={{ paddingTop: '56.25%' }}
      >
        <iframe
          className="absolute inset-0 h-full w-full rounded-2xl"
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&color=white`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-glow-sm">
      <video
        controls
        className="w-full rounded-2xl bg-black"
        src={url}
        style={{ maxHeight: '520px' }}
      >
        <track kind="captions" />
        Your browser does not support the video element.
      </video>
    </div>
  )
}
