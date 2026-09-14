import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-display font-bold text-gray-900">Our Vision</h1>
        <div className="w-20 h-1 bg-brand-primary mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            SKOPPOVIC is more than just a store; it is an exploration of the synergy between
            human creativity and artificial intelligence. We believe that AI is not a replacement
            for the artist, but a powerful new brush that allows us to visualize the impossible.
          </p>
          <p>
            Our mission is to provide homeowners, architects, and designers with high-end
            decorative art that challenges perception and enhances the emotional energy
            of a space.
          </p>
          <p>
            Every piece in our gallery is meticulously curated, refined, and produced to ensure
            the highest quality, blending digital precision with a boutique, artisanal feel.
          </p>
        </div>
        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border relative">
          <img
            src="https://images.unsplash.com/photo-1547826039-6575fd666ec6"
            alt="Art Studio"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      </div>

      <div className="mt-20 p-8 bg-gray-50 rounded-3xl border text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to transform your space?</h3>
        <p className="text-gray-600">Explore our latest collections and find the piece that speaks to you.</p>
        <Link
          to="/collections"
          className="inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-all"
        >
          View Collections
        </Link>
      </div>
    </div>
  )
}
