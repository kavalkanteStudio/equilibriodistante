import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927341รู้สึก-a-placeholder-art-image"
          alt="Featured Artwork"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight max-w-4xl mx-auto">
          Elevating Spaces with <span className="text-brand-primary">Digital Artistry</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
          Discover a curated collection of high-end decorative art, where cutting-edge AI innovation meets timeless aesthetic elegance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/collections"
            className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-all flex items-center gap-2 group"
          >
            Explore Collections
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30"
          >
            Our Vision
          </Link>
        </div>
      </div>
    </section>
  )
}
