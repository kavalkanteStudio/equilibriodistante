/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { useState, type Key } from 'react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import SEO from '@/components/SEO'
import ArtFrame from '@/components/ArtFrame'

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const { addToCart } = useCart()

  // 1. Fetch Artwork
  const { data: artwork, isLoading: artLoading, error: artError } = useQuery({
    queryKey: ['artwork', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    },
  })

  // 2. Fetch Products for this artwork
  const { data: products, isLoading: prodLoading, error: prodError } = useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      if (!artwork) return []
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('artwork_id', artwork.id)
        .eq('active', true)

      if (error) throw error
      return data
    },
    enabled: !!artwork,
  })

  // 3. Fetch collection by collection_id
  const { data: collection, isLoading: collLoading, error: collError } = useQuery({
    queryKey: ['collection', artwork?.collection_id],
    queryFn: async () => {
      if (!artwork) return null
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', artwork?.collection_id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!artwork,
  })

  if (artLoading || prodLoading) return <div className="flex min-h-screen items-center justify-center">Carregando Obra...</div>
  if (artError || prodError) return <div className="flex min-h-screen items-center justify-center text-brand-primary">Erro ao carregar obra.</div>
  if (!artwork) return <div className="flex min-h-screen items-center justify-center">Obra não encontrada.</div>
  if (collLoading) return <div className="flex min-h-screen items-center justify-center">Carregando Coleção...</div>
  if (collError) return <div className="flex min-h-screen items-center justify-center text-brand-primary">Erro ao carregar coleção.</div>


  // Find the first variant of the first product as default
  const defaultVariant = products?.[0]?.product_variants?.[0]?.id
  const currentVariantId = selectedVariantId || defaultVariant

  const currentProduct = products?.find(p => p.product_variants.some((v: any) => v.id === currentVariantId))
  const currentVariant = currentProduct?.product_variants.find((v: any) => v.id === currentVariantId)
  const isWideArtwork = artwork.orientation === 'a3-wide'
  const orientationLabel = isWideArtwork ? 'A3 wide (45 × 30 cm)' : 'A3 vertical (30 × 45 cm)'

  const handleAddToCart = () => {
    if (!currentVariant) return

    // Find the product this variant belongs to for the title
    addToCart({
      variantId: currentVariant.id,
      title: currentProduct?.title || 'Obra',
      variantName: currentVariant.name,
      price: Number(currentProduct?.base_price || 0),
      imageUrl: artwork.final_image_url,
      quantity: 1,
    })
  }

  const isWide = artwork.orientation === 'a3-wide'

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brand-septenary">
      <SEO title={artwork.title} description={artwork.prompt_summary} image={artwork.final_image_url} />
      <div className="max-w-7xl mx-auto">
        <Link to={`/coleção/${collection?.slug}`} className="text-brand-secondary hover:underline mb-24 inline-block">
          ← Coleção/{collection?.slug}
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Artwork Image */}
          <div>
            <div className={`${isWide? "aspect-16_9" : "aspect-9_16"} relative w-full overflow-hidden rounded-2xl bg-brand-secondary shadow-2xl`}>
              <img
                src={artwork.final_image_url}
                alt={artwork.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {artwork.additional_images?.map((imgUrl: string | undefined, index: Key | number) => (
                <div key={index} className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={imgUrl}
                    alt={`${artwork.title} - imagem adicional ${typeof index === 'number' ? index + 1 : ''}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Right: Details & Purchasing */}
          <div className="flex flex-col">

            {/* Page Header */}
            <div className="pb-8">
              <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
                <h1 className="text-2xl md:text-4xl">{artwork.title}</h1>
                <div className="w-24 h-1 bg-brand-secondary mx-auto" />
                <p className="text-lg text-brand-tertiary max-w-2xl mx-auto font-light">
                  {artwork.source_model}
                </p>
              </div>       
            </div>
            <div className="text-center p-4 bg-brand-senary rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-secondary mb-2">Resumo do Prompt</h3>
              <p className="text-gray-700 italic">"{artwork.prompt_summary}"</p>
            </div>
            <section className="my-8 border-y border-brand-secondary py-6">
              <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary text-center">Ficha da obra</h3>
              <dl className="grid gap-x-6 gap-y-4 text-xs leading-relaxed sm:grid-cols-2">
                <div>
                  <dt className="font-bold uppercase tracking-wider text-brand-secondary">Formato</dt>
                  <dd className="mt-1 text-gray-700">{orientationLabel}</dd>
                </div>
                {artwork.source_tool && (
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-brand-secondary">Origem</dt>
                    <dd className="mt-1 text-gray-700">{artwork.source_tool}</dd>
                  </div>
                )}
                {artwork.source_model && (
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-brand-secondary">Modelo</dt>
                    <dd className="mt-1 text-gray-700">{artwork.source_model}</dd>
                  </div>
                )}
                {artwork.source_plan && (
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-brand-secondary">Plano</dt>
                    <dd className="mt-1 text-gray-700">{artwork.source_plan}</dd>
                  </div>
                )}
                {artwork.license_type && (
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-brand-secondary">Licença</dt>
                    <dd className="mt-1 text-gray-700">{artwork.license_type}</dd>
                  </div>
                )}
                {artwork.credit_required && artwork.credit_text && (
                  <div>
                    <dt className="font-bold uppercase tracking-wider text-brand-secondary">Créditos</dt>
                    <dd className="mt-1 text-gray-700">{artwork.credit_text}</dd>
                  </div>
                )}
              </dl>

              {artwork.workflow_description && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                    Processo de criação
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-xs leading-6 text-brand-tertiary">
                    {artwork.workflow_description}
                  </p>
                </div>
              )}

              {artwork.license_notes && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                    Notas de licenciamento
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-brand-tertiary">{artwork.license_notes}</p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                {artwork.leonardo_url && (
                  <a
                    className="font-medium text-brand-tertiary hover:underline"
                    href={artwork.leonardo_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Link Oficial
                  </a>
                )}
                {artwork.civitai_url && (
                  <a
                    className="font-medium text-brand-tertiary hover:underline"
                    href={artwork.civitai_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Link Oficial
                  </a>
                )}
                {artwork.license_source_url && (
                  <a
                    className="font-medium text-brand-tertiary hover:underline"
                    href={artwork.license_source_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Ver Licença
                  </a>
                )}
              </div>
            </section>

            {products?.length === 0 ? (
              <p className="text-gray-500 text-xl text-left">Obra não disponível para compra.</p>
            ) : (
              <div className="space-y-8">
                {products?.map((product) => (
                  <div key={product.id} className="p-6 border rounded-2xl bg-brand-septenary shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{product.title}</h3>
                      <p className="text-sm text-gray-500">{product.product_type}</p>
                    </div>
                    <p className="text-brand-tertiary mb-6">{product.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {product.product_variants.map((variant: any) => (
                        <button
                          key={variant.id}
                          disabled={variant.stock_quantity <= 0}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`p-3 text-sm rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-40 ${currentVariantId === variant.id
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20'
                            : 'border-gray-200 hover:border-gray-300 text-brand-tertiary'
                            }`}
                        >
                          <div className="font-bold">{variant.name}</div>
                          <div className="text-xs opacity-70">{variant.stock_quantity > 0 ? `${variant.stock_quantity} em estoque` : 'Esgotado'}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {currentVariant && (
                  <div className="flex items-center justify-between p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
                    <div>
                      <p className="text-sm opacity-70 uppercase tracking-widest">Valor</p>
                      <p className="text-3xl font-bold">R${Number(currentProduct?.base_price || 0).toFixed(2)}</p>
                    </div>
                    <button
                      className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-colors"
                      disabled={currentVariant.stock_quantity <= 0}
                      onClick={handleAddToCart}
                    >
                      Adicionar ao Pacote
                    </button>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
        
        {/* Frame */}
        <div className="w-full flex-1 items-center justify-center p-8 md:p-20">
          <div id="crafted-artwork-composition" className="p-8">
            <div className={`mx-auto w-full ${isWide ? 'max-w-3xl' : 'max-w-lg'}`}>
              <ArtFrame
                orientation={artwork.orientation}
                imageUrl={artwork.final_image_url}
                alt={`${artwork.title} emoldurada`}
              />
            </div>
          </div>
          <p className="text-center text-sm md:text-base">Imagem ilustrativa</p>
        </div>
    </div>
  )
}
