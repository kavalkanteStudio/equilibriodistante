import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero01.jpg"
          alt="Featured Artwork"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/5 to-white" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col gap-4 items-center justify-center">
        <h1 className="text-black text-3xl md:text-6xl max-w-4xl mx-auto m-0!">
          SKOPPOVIC <span className="font-accent">CoLLeCCiOone</span>
        </h1>
        <p className="text-xl md:text-3xl">
          Arte para Exploraaaaaaaaaaaar e Adquirir.
        </p>
        <div className="md:text-xl flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/coleções"
            className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-all flex items-center gap-2 group"
          >
            Venha ver as Coleções
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/sobre"
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30"
          >
            Sobre
          </Link>
        </div>
      </div>
    </section>
  )
}
