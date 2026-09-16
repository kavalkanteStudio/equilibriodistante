/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { useState, type Key } from 'react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import SEO from '@/components/SEO'

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
  if (artError || prodError) return <div className="flex min-h-screen items-center justify-center text-red-500">Erro ao carregar obra.</div>
  if (!artwork) return <div className="flex min-h-screen items-center justify-center">Obra não encontrada.</div>
  if (collLoading) return <div className="flex min-h-screen items-center justify-center">Carregando Coleção...</div>
  if (collError) return <div className="flex min-h-screen items-center justify-center text-red-500">Erro ao carregar coleção.</div>


  // Find the first variant of the first product as default
  const defaultVariant = products?.[0]?.product_variants?.[0]?.id
  const currentVariantId = selectedVariantId || defaultVariant

  const currentProduct = products?.find(p => p.product_variants.some((v: any) => v.id === currentVariantId))
  const currentVariant = currentProduct?.product_variants.find((v: any) => v.id === currentVariantId)

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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <SEO title={artwork.title} description={artwork.prompt_summary} image={artwork.final_image_url} />
      <div className="max-w-7xl mx-auto">
        <Link to={`/coleção/${collection?.slug}`} className="text-brand-primary hover:underline mb-8 inline-block">
          ← Coleção
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Artwork Image */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
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
                    alt={`${artwork.title} - Additional ${`{index: typeof index === 'number' ? index + 1 : 'Unknown'}`}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-gray-200">
              <div className="p-2 bg-gray-50 text-gray-500 text-sm font-medium">AI Generated Image</div>
              <div
                className="relative mx-auto w-full overflow-hidden rounded-b-lg bg-gray-100 shadow-inner"
                style={{ aspectRatio: '1123 / 1587', maxWidth: '1123px' }}
              >
                <img
                  src="/images/A3-moldura.png"
                  alt="A3 Moldura"
                  className="absolute inset-0 h-full w-full object-fill"
                />
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: '16.3%',
                    top: '12%',
                    width: '67.3%',
                    height: '76.2%',
                  }}
                >
                  <img
                    src={artwork.final_image_url}
                    alt={`${artwork.title} emoldurada`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* <img
                src="/images/leonardoai/lucid-origin_A_solitary_woman_in_her_early_thirties_wearing_a_long_burnt-sienna_coat_seated_q-0.jpg"
                alt="lucid-origin A solitary woman in her early thirties wearing a long burnt-sienna coat seated q-0"
                className="h-full w-full object-cover"
              /> */}
            </div>
          </div>

          {/* Right: Details & Purchasing */}
          <div className="flex flex-col">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl mb-2">{artwork.title}</h1>
              <p className="text-lg text-gray-500 font-medium mb-4">{artwork.source_model}</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Artist's Note</h3>
                <p className="text-gray-700 italic">"{artwork.prompt_summary}"</p>
              </div>
            </header>

            {products?.length === 0 ? (
              <p className="text-gray-500 italic">Obra não disponível para compra.</p>
            ) : (
              <div className="space-y-8">
                {products?.map((product) => (
                  <div key={product.id} className="p-6 border rounded-2xl bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{product.title}</h3>
                      <p className="text-sm text-gray-500">{product.product_type}</p>
                    </div>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {product.product_variants.map((variant: any) => (
                        <button
                          key={variant.id}
                          disabled={variant.stock_quantity <= 0}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`p-3 text-sm rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-40 ${currentVariantId === variant.id
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
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
    </div>
  )
}
