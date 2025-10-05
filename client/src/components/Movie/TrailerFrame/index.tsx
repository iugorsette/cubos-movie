import { useState } from 'react'
import { PlayIcon } from '@radix-ui/react-icons'

function getEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1)
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    return url
  } catch {
    return url
  }
}

function getThumbnailUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    let videoId = ''
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || ''
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : ''
  } catch {
    return ''
  }
}

export default function TrailerFrame({ trailerUrl }: { trailerUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const height = window.innerWidth <= 480 ? '100%' : '100%'
  const embedUrl = getEmbedUrl(trailerUrl)
  const thumbnailUrl = getThumbnailUrl(trailerUrl)

  return (
    <div style={{ padding: '20px 30px' }}>
      <h2 style={{ marginBottom: '16px' }}>Trailer</h2>

      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        }}
      >
        {!isPlaying && (
          <div
            onClick={() => setIsPlaying(true)}
            style={{
              position: 'absolute',
              inset: 0,
              cursor: 'pointer',
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              className="overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  width: '70px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease, background-color 0.3s ease',
                }}
                className="play-button"
              >
                <PlayIcon width={35} height={35} color="#000" />
              </div>
            </div>
          </div>
        )}

        {isPlaying && (
          <iframe
            src={embedUrl}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height,
            }}
          ></iframe>
        )}
      </div>

      <style>
        {`
          .play-button:hover {
            transform: scale(1.1);
            background-color: rgba(255,255,255,1);
          }

          .overlay:hover {
            opacity: 1;
          }

          @media (max-width: 480px) {
            .play-button {
              width: 50px;
              height: 50px;
            }
          }
        `}
      </style>
    </div>
  )
}
