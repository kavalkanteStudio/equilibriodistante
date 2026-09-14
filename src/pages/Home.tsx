import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Hero from '@/components/Hero'

export default function Home() {
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'published')

      if (error) throw error
      return data
    },
  })

  return (
    <div className="flex flex-col w-full">
      <Hero />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-display font-bold text-gray-900">
            Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated series of artworks, each designed to bring a unique atmosphere and sophisticated energy to your interior.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-500 animate-pulse">Loading collections...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center max-w-2xl mx-auto">
            <p>Error loading collections: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="w-full max-w-6xl mx-auto">
            {collections?.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No published collections found. Let's add some!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections?.map((c) => (
                  <Link
                    key={c.id}
                    to={`/collection/${c.slug}`}
                    className="group relative overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
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
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {c.description}
                      </p>
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
