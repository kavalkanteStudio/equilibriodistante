import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import SEO from '@/components/SEO'

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: collection, isLoading: collLoading, error: collError } = useQuery({
    queryKey: ['collection', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: artworks, isLoading: artLoading, error: artError } = useQuery({
    queryKey: ['artworks', slug],
    queryFn: async () => {
      if (!collection) return []
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('collection_id', collection.id)
        .eq('published', true)

      if (error) throw error
      return data
    },
    enabled: !!collection,
  })

  if (collLoading || artLoading) return <div className="flex min-h-screen items-center justify-center">Carregando Coleção...</div>
  if (collError || artError) return <div className="flex min-h-screen items-center justify-center text-brand-primary">Erro ao carregar a Coleção.</div>
  if (!collection) return <div className="flex min-h-screen items-center justify-center">Coleção não encontrada.</div>

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brand-septenary">
      <SEO title={collection.name} description={collection.description} />
      <div className="max-w-7xl mx-auto">
        <Link to="/coleções" className="text-brand-primary hover:underline mb-8 inline-block">
          ← Coleções
        </Link>
        {/* Page Header */}
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-4xl">{collection.name}</h1>
            <div className="w-24 h-1 bg-brand-secondary mx-auto" />
            <p className="text-lg text-brand-tertiary max-w-2xl mx-auto font-light">
              {collection.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks?.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Sem obras publicadas nesta coleção.</p>
            ) : (
              artworks?.map((art) => (
                <div key={art.id} className="group relative overflow-hidden rounded-2xl border bg-brand-septenary transition-all hover:shadow-2xl hover:-translate-y-2">
                  <div className="aspect-square w-full overflow-hidden bg-brand-secondary">
                    <Link
                      to={`/obra/${art.slug}`}
                      className="h-full w-full"
                    > 
                      <img
                        src={art.final_image_url}
                        alt={art.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  </div>
                  {/*<div className="p-4">
                    <h3 className="text-xl font-bold">{art.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{art.source_model}</p>
                    <Link
                      to={`/obra/${art.slug}`}
                      className="block text-center py-2 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                    >
                      Mais Detalhes
                    </Link>
                  </div>*/}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
