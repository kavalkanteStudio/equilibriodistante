import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Collections() {
  const { data: collections, isLoading, error } = useQuery({
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
      <SEO title="Collections" description="Browse through our curated chapters of digital artistry." />
      {/* Page Header */}
      <div className="bg-gray-50 py-20 border-b">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900">
            Our Collections
          </h1>
          <div className="w-24 h-1 bg-brand-primary mx-auto" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Each collection represents a different exploration of form, light, and emotion.
            Step into our curated chapters of digital artistry.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {isLoading && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-500 animate-pulse">Curating collections...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center max-w-2xl mx-auto">
            <p>Error loading collections: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {collections?.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 col-span-full">No published collections found.</p>
            ) : (
              collections?.map((c) => (
                <Link
                  key={c.id}
                  to={`/collection/${c.slug}`}
                  className="group relative flex flex-col md:flex-row gap-8 items-center bg-white border rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:border-brand-primary/30"
                >
                  <div className="w-full md:w-2/5 aspect-square overflow-hidden bg-gray-100">
                    {c.cover_image ? (
                      <img
                        src={c.cover_image}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        No cover image
                      </div>
                    )}
                  </div>

                  <div className="p-8 md:p-10 flex-1 space-y-4">
                    <h3 className="text-3xl font-display font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-light line-clamp-3">
                      {c.description}
                    </p>
                    <div className="pt-4 flex items-center gap-2 text-brand-primary font-bold group-hover:gap-4 transition-all">
                      Explore Collection
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
        {
          (
            collections?.map((c) => (
              <Link
                key={c.id}
                to={`/collection/${c.slug}`}
                className="group relative flex flex-col md:flex-row gap-8 items-center bg-white border rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:border-brand-primary/30"
              >
                <div className="w-full md:w-2/5 aspect-square overflow-hidden bg-gray-100">
                  {c.cover_image ? (
                    <img
                      src={c.cover_image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No cover image
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-10 flex-1 space-y-4">
                  <h3 className="text-3xl font-display font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light line-clamp-3">
                    {c.description}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-brand-primary font-bold group-hover:gap-4 transition-all">
                    Explore Collection
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))
          )
        }
      </div>
    </div>
  )
}
