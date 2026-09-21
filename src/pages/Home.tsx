import Hero from '@/components/Hero'
import InfiniteArtworkGallery from '@/components/InfiniteArtworkGallery'
import SEO from '@/components/SEO'

export default function Home() {
  
  return (
    <div className="flex flex-col w-full">
      <SEO title="Home" description="SKOPPOVIC CoLLeCCiOone. A coleção de arte decorativa e artesanato de baixo custo. Centenas de imagens selecionadas para você explorar." />
      <Hero />
      <InfiniteArtworkGallery />
    </div>
  )
}
