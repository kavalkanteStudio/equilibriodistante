import { useLayoutEffect, useRef, useState } from 'react'
import './ArtFrame.css'

type ArtFrameOrientation = 'a3-vertical' | 'a3-wide'

type ArtFrameProps = {
  orientation?: ArtFrameOrientation | string | null
  imageUrl: string
  alt: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

const readyArtworkImages = new Set<string>()

function getInitialImageStatus(imageUrl: string) {
  return readyArtworkImages.has(imageUrl) ? 'ready' as const : 'loading' as const
}

export default function ArtFrame({
  orientation,
  imageUrl,
  alt,
  loading = 'lazy',
  fetchPriority = 'auto',
}: ArtFrameProps) {
  const isWide = orientation === 'a3-wide'
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageStatus, setImageStatus] = useState<'loading' | 'ready' | 'error'>(() => getInitialImageStatus(imageUrl))

  useLayoutEffect(() => {
    const image = imageRef.current
    if (readyArtworkImages.has(imageUrl) || image?.complete && image.naturalWidth > 0) {
      readyArtworkImages.add(imageUrl)
      setImageStatus('ready')
    } else {
      setImageStatus('loading')
    }
  }, [imageUrl])

  function handleImageLoad() {
    readyArtworkImages.add(imageUrl)
    setImageStatus('ready')
  }

  return (
    <div className={`art-frame ${isWide ? 'art-frame--wide' : 'art-frame--vertical'}`}>
      <div className="art-frame__wood art-frame__wood--top" />
      <div className="art-frame__wood art-frame__wood--right" />
      <div className="art-frame__wood art-frame__wood--bottom" />
      <div className="art-frame__wood art-frame__wood--left" />
      <div className="art-paper" />
      <div className="art-frame__mat" aria-hidden="true" />
      <div className={`art-frame__art art-frame__art--${imageStatus}`}>
        <img
          ref={imageRef}
          className="art-frame__image object-cover"
          src={imageUrl}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={handleImageLoad}
          onError={() => setImageStatus('error')}
        />
        {imageStatus === 'error' && (
          <span className="art-frame__fallback" role="status">
            Imagem indisponível
          </span>
        )}
      </div>
    </div>
  )
}
