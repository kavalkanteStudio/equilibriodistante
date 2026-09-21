import { useLayoutEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import ArtFrame from './ArtFrame'
import { supabase } from '@/lib/supabase'
import './InfiniteArtworkGallery.css'

type Artwork = {
  id: string
  slug: string
  title: string
  final_image_url: string
  orientation: string | null
}

export default function InfiniteArtworkGallery() {
  const trackRef = useRef<HTMLUListElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const { data: artworks = [], isLoading } = useQuery({
    queryKey: ['home-artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, slug, title, final_image_url, orientation')
        .eq('published', true)
        .not('final_image_url', 'is', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Artwork[]
    },
  })

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)
    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useLayoutEffect(() => {
    if (!trackRef.current || artworks.length < 2 || prefersReducedMotion) return

    const track = trackRef.current
    const cards = track.querySelectorAll<HTMLElement>('[data-artwork-card]')
    const half = Math.ceil(cards.length / 2)
    const cardWidth = cards[0]?.offsetWidth || 0
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0
    const loopDistance = half * (cardWidth + gap)

    if (!loopDistance) return

    const animation = gsap.to(track, {
      x: -loopDistance,
      duration: Math.max(artworks.length * 5, 24),
      ease: 'none',
      repeat: -1,
      paused: isPaused,
    })

    animationRef.current = animation
    return () => {
      animation.kill()
      animationRef.current = null
    }
  }, [artworks.length, isPaused, prefersReducedMotion])

  function move(direction: 1 | -1) {
    if (!animationRef.current || prefersReducedMotion) return
    const nextTime = animationRef.current.time() + direction * 1.5
    animationRef.current.time(nextTime)
  }

  function togglePause() {
    setIsPaused((current) => !current)
  }

  if (isLoading || artworks.length === 0) return null

  const displayedArtworks = prefersReducedMotion ? artworks : [...artworks, ...artworks]

  return (
    <section className="infinite-gallery" aria-labelledby="infinite-gallery-title">
      <div className="infinite-gallery__intro">
        <p className="infinite-gallery__eyebrow">Passeio pela coleção</p>
        <h2 id="infinite-gallery-title">Obras para contemplar</h2>
        <p>Uma seleção em movimento, entre diferentes formas, atmosferas e coleções.</p>
      </div>

      <div className="infinite-gallery__viewport">
        <ul className="infinite-gallery__track" ref={trackRef}>
          {displayedArtworks.map((artwork, index) => (
            <li
              className="infinite-gallery__card"
              data-artwork-card
              key={`${artwork.id}-${index}`}
              aria-hidden={index >= artworks.length}
            >
              <Link to={`/obra/${artwork.slug}`} tabIndex={index >= artworks.length ? -1 : undefined}>
                <ArtFrame
                  orientation={artwork.orientation}
                  imageUrl={artwork.final_image_url}
                  alt={artwork.title}
                />
                <span className="infinite-gallery__caption">{artwork.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="infinite-gallery__controls" aria-label="Controles da galeria">
        <button type="button" onClick={() => move(-1)} aria-label="Obra anterior" disabled={prefersReducedMotion}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <button type="button" onClick={togglePause} aria-label={isPaused ? 'Retomar galeria' : 'Pausar galeria'}>
          {isPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Próxima obra" disabled={prefersReducedMotion}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}