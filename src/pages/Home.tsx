import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-display font-bold mb-4 text-brand-primary text-center">
        Decorative Art Store
      </h1>

      {isLoading && <p className="text-lg">Loading collections...</p>}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Error loading collections: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="text-center w-full max-w-6xl">
          <p className="text-lg mb-8">Explore our curated art collections</p>
          {collections?.length === 0 ? (
            <p className="text-muted-foreground">No published collections found. Let's add some!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections?.map((c) => (
                <Link
                  key={c.id}
                  to={`/collection/${c.slug}`}
                  className="group relative overflow-hidden rounded-xl border bg-white transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    {c.cover_image ? (
                      <img
                        src={c.cover_image}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        No cover image
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
