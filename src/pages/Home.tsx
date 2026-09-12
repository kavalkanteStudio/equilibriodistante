import { useQuery } from '@tanstack/react-query'
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
      <h1 className="text-4xl font-display font-bold mb-4 text-brand-primary">
        Decorative Art Store
      </h1>

      {isLoading && <p className="text-lg">Loading collections...</p>}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Error loading collections: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="text-center">
          <p className="text-lg mb-6">Welcome to our art gallery!</p>
          {collections?.length === 0 ? (
            <p className="text-muted-foreground">No published collections found. Let's add some!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {collections?.map((c) => (
                <div key={c.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold">{c.name}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
