import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <SEO title="About Us" description="Discover the vision and philosophy behind SKOPPOVIC's digital art curation." />
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl">Sobre</h1>
        <div className="w-20 h-1 bg-brand-primary mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="h-full flex flex-col items-start justify-between text-lg text-gray-600 leading-relaxed">
          <p>
            A Coleção SKOPPOVIC propõe Expressão, mensagens coloridas simples, de minimalismo, arte pop e conceitual. Em cada peça reunimos emoção e conhecimento humano revelados no tempo. Nosso trabalho é combinar ideias, tecnologias e impressão artesanal com o uso massivo de Inteligência artificial, criando novas referências, encontros e possibilidades.
          </p>
          <p>
            Nossa missão é proporcionar aos proprietários de casas, síndicos, arquitetos e designers uma arte decorativa de qualidade digital que dá um toque artístico e personalizado a qualquer espaço.
          </p>
          <p>
            Cada obra é cuidadosamente curada, refinada e produzida para garantir um resultado prático, combinando precisão digital com toque artesanal.
          </p>
        </div>
        <div className="aspect-auto rounded-3xl overflow-hidden border relative">
          <img
            src="/images/hero02.jpg"
            alt="Art Studio"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      </div>

      <div className="mt-20 p-8 bg-gray-50 rounded-3xl border text-center space-y-4">
        <h3 className="text-2xl font-bold">Pronto para transformar seu espaço?</h3>
        <p className="text-gray-600">Encontre obras imaginadas e re-imaginadas.</p>
        <Link
          to="/collections"
          className="mt-4 inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-all"
        >
          Ver as coleções
        </Link>
      </div>
    </div>
  )
}
