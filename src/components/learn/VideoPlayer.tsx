'use client'

function parseEmbed(url: string): { kind: 'iframe'; src: string } | { kind: 'video'; src: string } {
  // YouTube (watch, youtu.be, embed, shorts)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (ytMatch?.[1]) {
    return {
      kind: 'iframe',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    }
  }

  // Google Drive (/file/d/<id>/... or ?id=<id>)
  const driveMatch =
    url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) ||
    url.match(/drive\.google\.com\/open\?id=([^&#]+)/)
  if (driveMatch?.[1]) {
    return {
      kind: 'iframe',
      src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    }
  }

  // Vimeo (vimeo.com/<id>)
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch?.[1]) {
    return {
      kind: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    }
  }

  return { kind: 'video', src: url }
}

interface VideoPlayerProps {
  url: string
  title: string
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const media = parseEmbed(url)

  if (media.kind === 'iframe') {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-[#DDE3EC]/12 bg-black shadow-2xl">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={media.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDE3EC]/12 bg-black shadow-2xl">
      <video
        controls
        className="w-full max-h-[540px] bg-black"
        src={media.src}
      >
        <track kind="captions" />
        Your browser does not support the video element.
      </video>
    </div>
  )
}
