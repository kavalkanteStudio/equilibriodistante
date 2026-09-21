import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const stageRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
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

  const currentIndex = artworks.length > 0 ? activeIndex % artworks.length : 0

  useEffect(() => {
    if (artworks.length < 2 || isPaused || prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % artworks.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [artworks.length, isPaused, prefersReducedMotion])

  useLayoutEffect(() => {
    if (!stageRef.current || artworks.length === 0) return

    const stage = stageRef.current
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-artwork-card]'))
    const sideOffset = Math.min(window.innerWidth * 0.28, 360)

    cards.forEach((card, index) => {
      const distance = artworks.length === 1 ? 0 : (index - currentIndex) % artworks.length
      const normalizedDistance = distance < -1 ? distance - artworks.length : distance > 1 ? distance + artworks.length : distance
      const isCenter = normalizedDistance === 0
      const isSide = Math.abs(normalizedDistance) === 1
      const x = normalizedDistance * sideOffset

      gsap.to(card, {
        x,
        scale: isCenter ? 1 : 0.68,
        autoAlpha: isCenter ? 1 : isSide ? 0.62 : 0,
        zIndex: isCenter ? 3 : isSide ? 2 : 0,
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: 'power3.inOut',
        pointerEvents: isCenter || isSide ? 'auto' : 'none',
      })
    })

    return () => {
      gsap.killTweensOf(cards)
    }
  }, [currentIndex, artworks.length, prefersReducedMotion])

  useEffect(() => {
    const nearbyArtworks = artworks.length > 0
      ? [-2, -1, 0, 1, 2].map((offset) => artworks[(currentIndex + offset + artworks.length) % artworks.length])
      : []

    nearbyArtworks.forEach((artwork) => {
      const image = new Image()
      image.src = artwork.final_image_url
    })
  }, [currentIndex, artworks])

  function move(direction: 1 | -1) {
    if (artworks.length < 2) return
    setActiveIndex((current) => (current + direction + artworks.length) % artworks.length)
  }

  function togglePause() {
    setIsPaused((current) => !current)
  }

  if (isLoading || artworks.length === 0) return null

  return (
    <section className="infinite-gallery" aria-labelledby="infinite-gallery-title">
      <div className="infinite-gallery__intro">
        <p className="infinite-gallery__eyebrow">Passeio pela coleção</p>
        <h2 id="infinite-gallery-title">Obras para contemplar</h2>
        <p>Uma seleção em movimento, entre diferentes formas, atmosferas e coleções.</p>
      </div>

      <div className="infinite-gallery__viewport">
        <ul className="infinite-gallery__stage" ref={stageRef}>
          {artworks.map((artwork, index) => (
            <li
              className="infinite-gallery__card"
              data-artwork-card
              key={artwork.id}
              aria-hidden={index !== currentIndex && Math.abs(index - currentIndex) !== 1}
            >
              <Link to={`/obra/${artwork.slug}`} tabIndex={index === currentIndex || Math.abs(index - currentIndex) === 1 ? undefined : -1}>
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
        <button type="button" onClick={() => move(-1)} aria-label="Obra anterior" disabled={artworks.length < 2}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <button type="button" onClick={togglePause} aria-label={isPaused ? 'Retomar galeria' : 'Pausar galeria'}>
          {isPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Próxima obra" disabled={artworks.length < 2}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}