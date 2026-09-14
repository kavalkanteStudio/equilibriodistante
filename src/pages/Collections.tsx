import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Collections() {
  const {
    data: collections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Coleções"
        description="Uma curadoria de centenas de imagens de obras imaginadas e re-imaginadas, cada uma projetada para trazer uma atmosfera única e uma energia sofisticada ao seu espaço."
      />
      {/* Page Header */}
      <div className="bg-gray-50 py-20 border-b">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl">Coleções</h1>
          <div className="w-24 h-1 bg-brand-primary mx-auto" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Descubra obras digitais interessantes. Em cada coleção, você encontra imagens que capturam formas, luz e emoção.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {isLoading && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-500 animate-pulse">Carregado as coleções...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center max-w-2xl mx-auto">
            <p>
              Erro ao carregar coleções: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="w-full max-w-6xl mx-auto">
            {collections?.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Sem coleções publicadas por enquanto.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections?.map((c) => (
                  <Link
                    key={c.id}
                    to={`/coleção/${c.slug}`}
                    className="group relative overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="aspect-4/3 w-full overflow-hidden bg-gray-100">
                      {c.cover_image ? (
                        <img
                          src={c.cover_image}
                          alt={c.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          No cover image
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">{c.description}</p>
                    </div>
                    <div className="p-6 flex items-center gap-2 text-brand-primary group-hover:gap-4 transition-all">
                      Ver a Coleção
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
