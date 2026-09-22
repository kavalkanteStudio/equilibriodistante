import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero01.jpg"
          alt="Featured Artwork"
          className="w-full h-full object-cover opacity-80"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/5 to-[#f4f0e9]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col gap-4 items-center justify-center">
        <p className="font-display text-gray-900 text-2xl md:text-4xl max-w-4xl mx-auto m-0!">
          SKOPPOVIC <span className="font-accent">CoLLeCCiOone</span>
        </p>
        <p className="text-xl md:text-2xl">
          Arte para Explorar e Adquirir.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/coleções"
            className="px-4 py-2 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-all flex items-center gap-2 group"
          >
            Coleções
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/sobre"
            className="px-4 py-2 bg-brand-septenary/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-brand-septenary/20 transition-all border border-white/30"
          >
            Sobre
          </Link>
        </div>
      </div>
    </section>
  )
}
