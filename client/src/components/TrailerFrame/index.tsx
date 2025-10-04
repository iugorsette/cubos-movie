function getEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v')
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1)
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  } catch {
    return url
  }
}

export default function TrailerFrame({ trailerUrl }: { trailerUrl: string }) {
  const height = window.innerWidth <= 480 ? '100%' : '65%'
  return (
    <div style={{ padding: '20px 30px' }}>
      <h2 style={{ marginBottom: '16px' }}>Trailer</h2>
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
        }}>
        <iframe
          src={getEmbedUrl(trailerUrl)}
          title='Trailer'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: height,
          }}></iframe>
      </div>
    </div>
  )
}
