import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ArrowRight, LoaderCircle } from 'lucide-react'
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
    <div className="min-h-screen bg-brand-septenary">
      <SEO
        title="Coleções"
        description="Coleção SKOPPOVIC CoLLeCCiOone. Em cada coleção, você encontra imagens que capturam formas, luz e emoção. Descubra obras digitais interessantes."
      />
      {/* Page Header */}
      <div className="bg-brand-senary py-20 border-b">
        <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl">Formas, Luz e Emoção</h1>
          <div className="w-24 h-1 bg-brand-primary mx-auto" />
          <p className="text-lg text-brand-tertiary max-w-2xl mx-auto font-light">
            Descubra obras digitais interessantes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {isLoading && (
          <div className="flex justify-center py-12">
            <p className="text-brand-tertiary"><span className="flex animate-spin"><LoaderCircle className="w-8 h-8" /></span></p>
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
                    className="group relative overflow-hidden rounded-2xl border bg-brand-septenary transition-all hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="aspect-4/3 w-full overflow-hidden bg-brand-secondary">
                      {c.cover_image ? (
                        <img
                          src={c.cover_image}
                          alt={c.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-secondary text-sm font-medium">
                          No cover image
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-sm text-brand-tertiary line-clamp-2 mt-2">{c.description}</p>
                    </div>
                    <div className="text-sm p-6 flex items-center gap-2 text-brand-tertiary hover:text-brand-primary group-hover:gap-4 transition-all">
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
