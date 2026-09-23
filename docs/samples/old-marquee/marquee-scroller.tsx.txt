import React from 'react'
import Image from 'next/image'
import './marquee-scroller.css'

export default function MarqueeScroller({
  logos = [
    '/next.svg',
    '/vercel.svg',
    '/globe.svg',
    '/file.svg',
    '/window.svg',
  ],
  duration = 36,
  rows = 2,
}: {
  logos?: string[]
  duration?: number
  rows?: number
}) {
  const sets = Array.from({ length: rows }).map((_, i) => ({
    id: i,
    logos: logos,
    direction: i % 2 === 0 ? 'left' : 'right',
  }))

  return (
    <section className="marquee-wrapper" aria-label="Partners and integrations">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {sets.map((set) => (
            <div key={set.id} className="marquee-container" data-direction={set.direction} style={{ ['--marquee-duration' as any]: `${duration}s` }}>
              <div className="marquee-track" aria-hidden>
                {set.logos.concat(set.logos).map((src, idx) => (
                  <div className="marquee-item" key={`${src}-${idx}`}>
                    <Image src={src} alt="Partner logo" width={120} height={48} className="object-contain" />
                  </div>
                ))}
              </div>
              {/* Duplicate for screen-reader-safe content: provide one visible track for assistive tech */}
              <div className="sr-only" aria-hidden={false}>
                {set.logos.map((src, idx) => (
                  <span key={`sr-${src}-${idx}`}>Partner logo</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
