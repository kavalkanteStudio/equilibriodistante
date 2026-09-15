import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import ImageUploadField from '@/components/ImageUploadField'

type Collection = {
  id: string
  slug: string
  name: string
  description: string | null
  cover_image: string | null
  status: string
}

type CollectionForm = Omit<Collection, 'id'>

const emptyForm: CollectionForm = {
  slug: '',
  name: '',
  description: '',
  cover_image: '',
  status: 'draft',
}

export default function AdminDashboard() {
  const { session, signOut } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [form, setForm] = useState<CollectionForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadCollections() {
    setIsLoading(true)
    const { data, error: queryError } = await supabase.from('collections').select('*').order('created_at', { ascending: false })
    if (queryError) setError(queryError.message)
    else setCollections(data as Collection[])
    setIsLoading(false)
  }

  useEffect(() => {
    void loadCollections()
  }, [])

  function startEditing(collection: Collection) {
    setEditingId(collection.id)
    setForm({
      slug: collection.slug,
      name: collection.name,
      description: collection.description || '',
      cover_image: collection.cover_image || '',
      status: collection.status,
    })
    setError(null)
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
  }

  async function saveCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    const payload = {
      ...form,
      description: form.description || null,
      cover_image: form.cover_image || null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    }
    const result = editingId
      ? await supabase.from('collections').update(payload).eq('id', editingId)
      : await supabase.from('collections').insert(payload)

    if (result.error) setError(result.error.message)
    else {
      resetForm()
      await loadCollections()
    }
    setIsSaving(false)
  }

  async function deleteCollection(id: string) {
    if (!window.confirm('Excluir esta coleção e as obras relacionadas?')) return
    const { error: deleteError } = await supabase.from('collections').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else await loadCollections()
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">Skoppovic CMS</p>
            <h1 className="text-4xl font-display">Catálogo</h1>
            <p className="text-sm text-gray-500">{session?.user.email}</p>
          </div>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium" onClick={() => void signOut()} type="button">Sair</button>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-display">Coleções</h2>
              <button className="text-sm font-bold text-brand-primary" onClick={resetForm} type="button">Nova coleção</button>
            </div>
            {isLoading ? <p className="text-gray-500">Carregando...</p> : collections.length === 0 ? <p className="text-gray-500">Nenhuma coleção cadastrada.</p> : (
              <div className="divide-y divide-gray-100">
                {collections.map((collection) => (
                  <article className="flex items-center justify-between gap-4 py-4" key={collection.id}>
                    <div>
                      <h3 className="font-bold">{collection.name}</h3>
                      <p className="text-sm text-gray-500">/{collection.slug} · {collection.status}</p>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <button className="font-bold text-brand-primary" onClick={() => startEditing(collection)} type="button">Editar</button>
                      <button className="font-bold text-red-600" onClick={() => void deleteCollection(collection.id)} type="button">Excluir</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-display">{editingId ? 'Editar coleção' : 'Nova coleção'}</h2>
            <form className="space-y-4" onSubmit={saveCollection}>
              <label className="block text-sm font-medium">Nome<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
              <label className="block text-sm font-medium">Slug<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
              <label className="block text-sm font-medium">Descrição<textarea className="mt-1 w-full rounded-lg border border-gray-300 p-3" rows={4} value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <div>
                <p className="mb-2 block text-sm font-medium">Capa da coleção</p>
                <ImageUploadField
                  value={form.cover_image || ''}
                  onChange={(coverImage) => setForm({ ...form, cover_image: coverImage })}
                  pathPrefix={`collections/${editingId || 'pending'}`}
                  disabled={!editingId}
                />
                {!editingId && <p className="mt-2 text-xs text-gray-500">Salve a coleção primeiro para habilitar o upload.</p>}
                <label className="mt-3 block text-sm font-medium">Ou cole uma URL direta<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" type="url" value={form.cover_image || ''} onChange={(event) => setForm({ ...form, cover_image: event.target.value })} /></label>
              </div>
              <label className="block text-sm font-medium">Status<select className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="draft">Rascunho</option><option value="published">Publicado</option></select></label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button className="rounded-lg bg-gray-900 px-4 py-3 font-bold text-white disabled:opacity-50" disabled={isSaving} type="submit">{isSaving ? 'Salvando...' : 'Salvar'}</button>
                {editingId && <button className="rounded-lg border border-gray-300 px-4 py-3 font-bold" onClick={resetForm} type="button">Cancelar</button>}
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
