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
        <div className="flex flex-col items-start h-full gap-8 text-gray-700">
          <p className="text-left text-normal">
            A Coleção SKOPPOVIC propõe Expressão, mensagens coloridas simples, de minimalismo, arte pop e conceitual.
          </p>
          <p className="text-left text-normal">
            Em cada peça reunimos emoção e conhecimento humano revelados no tempo.
          </p>
          <p className="text-left text-normal">
            Nosso trabalho é combinar ideias, tecnologias e impressão artesanal com o uso massivo de Inteligência artificial, criando novas referências, encontros e possibilidades.
          </p>
          <p className="text-left text-normal">
            São imagens digitais, selecionadas para inspirar e decorar espaços com arte acessível.
          </p>
          <p className="text-left text-normal">
            Cada item é escolhido para provocar reflexão, emoção e apreciação estética, tornando a arte digital uma experiência envolvente.
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
