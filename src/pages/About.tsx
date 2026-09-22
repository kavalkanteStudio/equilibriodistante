import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import { ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <SEO title="Sobre" description="A Coleção SKOPPOVIC propõe Expressão, mensagens coloridas simples, de minimalismo, arte pop e conceitual." />
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-2xl md:text-4xl">Sobre Expressão e Cor</h1>
        <div className="w-20 h-1 bg-brand-primary mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 items-center">
        
        <div className="rounded-3xl overflow-hidden border relative">
          <img
            src="/images/hero02.jpg"
            alt="Pôr do sol"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>

        <div className="h-full flex flex-col justify-around gap-4 text-gray-700 leading-8">
          <p className="text-xl">
            A Coleção SKOPPOVIC propõe Expressão, mensagens coloridas simples, de minimalismo, arte pop e conceitual.
          </p>
          <p className="text-xl">
            Em cada peça reunimos emoção e conhecimento humano revelados no tempo.
          </p>
          <p className="text-xl">
            Nosso trabalho é combinar ideias, tecnologias e impressão artesanal com o uso massivo de Inteligência artificial, criando novas referências, encontros e possibilidades.
          </p>
          <p className="text-xl">
            São imagens digitais, selecionadas para inspirar e decorar espaços com arte acessível.
          </p>
          {/* <p className="text-xl">
            Cada item é escolhido para provocar reflexão, emoção e apreciação estética, tornando a arte digital uma experiência envolvente.
          </p> */}
        </div>
      </div>

      <div className="mt-20 p-8 bg-brand-senary rounded-3xl border flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl md:text-2xl font-bold">Transforme seu Ambiente</h3>
        <p className="text-brand-tertiary text-lg text-center">Cada item é escolhido para provocar reflexão, emoção e apreciação estética, tornando a arte digital uma experiência envolvente.</p>
        <Link
          to="/coleções"
          className="px-4 py-2 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-all flex items-center gap-2 group"
        >
          Visitar Coleções
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
