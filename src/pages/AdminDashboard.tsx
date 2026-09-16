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

type Artwork = {
  id: string
  collection_id: string | null
  title: string
  slug: string
  prompt_summary: string | null
  workflow_description: string | null
  civitai_url: string | null
  leonardo_url: string | null
  license_notes: string | null
  source_model: string | null
  source_tool: string | null
  source_plan: string | null
  license_status: 'pending' | 'approved' | 'rejected'
  license_type: string | null
  license_source_url: string | null
  credit_required: boolean
  credit_text: string | null
  orientation: 'a3-vertical' | 'a3-wide'
  final_image_url: string | null
  published: boolean
}

type ArtworkForm = Omit<Artwork, 'id'>

const emptyForm: CollectionForm = {
  slug: '',
  name: '',
  description: '',
  cover_image: '',
  status: 'draft',
}

const emptyArtworkForm: ArtworkForm = {
  collection_id: '',
  title: '',
  slug: '',
  prompt_summary: '',
  workflow_description: '',
  civitai_url: '',
  leonardo_url: '',
  license_notes: '',
  source_model: '',
  source_tool: '',
  source_plan: '',
  license_status: 'pending',
  license_type: '',
  license_source_url: '',
  credit_required: false,
  credit_text: '',
  orientation: 'a3-vertical',
  final_image_url: '',
  published: false,
}

export default function AdminDashboard() {
  const { session, signOut } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [form, setForm] = useState<CollectionForm>(emptyForm)
  const [artworkForm, setArtworkForm] = useState<ArtworkForm>(emptyArtworkForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null)
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

  async function loadArtworks() {
    const { data, error: queryError } = await supabase.from('artworks').select('*').order('created_at', { ascending: false })
    if (queryError) setError(queryError.message)
    else setArtworks((data || []) as Artwork[])
  }

  useEffect(() => {
    void Promise.resolve().then(() => Promise.all([loadCollections(), loadArtworks()]))
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

  function startEditingArtwork(artwork: Artwork) {
    setEditingArtworkId(artwork.id)
    setArtworkForm({
      collection_id: artwork.collection_id || '',
      title: artwork.title,
      slug: artwork.slug,
      prompt_summary: artwork.prompt_summary || '',
      workflow_description: artwork.workflow_description || '',
      civitai_url: artwork.civitai_url || '',
      leonardo_url: artwork.leonardo_url || '',
      license_notes: artwork.license_notes || '',
      source_model: artwork.source_model || '',
      source_tool: artwork.source_tool || '',
      source_plan: artwork.source_plan || '',
      license_status: artwork.license_status,
      license_type: artwork.license_type || '',
      license_source_url: artwork.license_source_url || '',
      credit_required: artwork.credit_required,
      credit_text: artwork.credit_text || '',
      orientation: artwork.orientation,
      final_image_url: artwork.final_image_url || '',
      published: artwork.published,
    })
    setError(null)
  }

  function resetArtworkForm() {
    setEditingArtworkId(null)
    setArtworkForm(emptyArtworkForm)
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

  async function saveArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    if (artworkForm.published && artworkForm.license_status !== 'approved') {
      setError('A obra só pode ser publicada após a licença ser aprovada.')
      setIsSaving(false)
      return
    }

    const payload = {
      ...artworkForm,
      collection_id: artworkForm.collection_id || null,
      prompt_summary: artworkForm.prompt_summary || null,
      workflow_description: artworkForm.workflow_description || null,
      civitai_url: artworkForm.civitai_url || null,
      leonardo_url: artworkForm.leonardo_url || null,
      license_notes: artworkForm.license_notes || null,
      source_model: artworkForm.source_model || null,
      source_tool: artworkForm.source_tool || null,
      source_plan: artworkForm.source_plan || null,
      license_type: artworkForm.license_type || null,
      license_source_url: artworkForm.license_source_url || null,
      credit_text: artworkForm.credit_text || null,
      final_image_url: artworkForm.final_image_url || null,
      published: artworkForm.published && artworkForm.license_status === 'approved',
    }
    const result = editingArtworkId
      ? await supabase.from('artworks').update(payload).eq('id', editingArtworkId)
      : await supabase.from('artworks').insert(payload)

    if (result.error) setError(result.error.message)
    else {
      resetArtworkForm()
      await loadArtworks()
    }
    setIsSaving(false)
  }

  async function deleteArtwork(id: string) {
    if (!window.confirm('Excluir esta obra?')) return
    const { error: deleteError } = await supabase.from('artworks').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else await loadArtworks()
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

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-display">{editingArtworkId ? 'Editar obra' : 'Nova obra'}</h2>
            <form className="space-y-4" onSubmit={saveArtwork}>
              <label className="block text-sm font-medium">Título<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.title} onChange={(event) => setArtworkForm({ ...artworkForm, title: event.target.value })} required /></label>
              <label className="block text-sm font-medium">Slug<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.slug} onChange={(event) => setArtworkForm({ ...artworkForm, slug: event.target.value })} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
              <label className="block text-sm font-medium">Coleção<select className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.collection_id || ''} onChange={(event) => setArtworkForm({ ...artworkForm, collection_id: event.target.value })}><option value="">Sem coleção</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">Orientação<select className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.orientation} onChange={(event) => setArtworkForm({ ...artworkForm, orientation: event.target.value as ArtworkForm['orientation'] })}><option value="a3-vertical">A3 vertical (30x45)</option><option value="a3-wide">A3 wide (45x30)</option></select></label>
                <label className="block text-sm font-medium">Revisão da licença<select className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.license_status} onChange={(event) => setArtworkForm({ ...artworkForm, license_status: event.target.value as ArtworkForm['license_status'], published: false })}><option value="pending">Pendente</option><option value="approved">Aprovada</option><option value="rejected">Rejeitada</option></select></label>
              </div>
              <div>
                <p className="mb-2 block text-sm font-medium">Imagem final</p>
                <ImageUploadField value={artworkForm.final_image_url || ''} onChange={(finalImageUrl) => setArtworkForm({ ...artworkForm, final_image_url: finalImageUrl })} pathPrefix={`artworks/${editingArtworkId || 'pending'}`} disabled={false} />
                <label className="mt-3 block text-sm font-medium">Ou cole uma URL direta<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" type="url" value={artworkForm.final_image_url || ''} onChange={(event) => setArtworkForm({ ...artworkForm, final_image_url: event.target.value })} /></label>
              </div>
              <label className="block text-sm font-medium">Resumo do prompt<textarea className="mt-1 w-full rounded-lg border border-gray-300 p-3" rows={3} value={artworkForm.prompt_summary || ''} onChange={(event) => setArtworkForm({ ...artworkForm, prompt_summary: event.target.value })} /></label>
              <label className="block text-sm font-medium">Descrição do workflow<textarea className="mt-1 w-full rounded-lg border border-gray-300 p-3" rows={3} value={artworkForm.workflow_description || ''} onChange={(event) => setArtworkForm({ ...artworkForm, workflow_description: event.target.value })} /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">Ferramenta<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.source_tool || ''} onChange={(event) => setArtworkForm({ ...artworkForm, source_tool: event.target.value })} placeholder="Leonardo AI" /></label>
                <label className="block text-sm font-medium">Modelo<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.source_model || ''} onChange={(event) => setArtworkForm({ ...artworkForm, source_model: event.target.value })} /></label>
              </div>
              <label className="block text-sm font-medium">Plano utilizado<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.source_plan || ''} onChange={(event) => setArtworkForm({ ...artworkForm, source_plan: event.target.value })} placeholder="Pago, gratuito ou licença do modelo" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">Tipo de licença<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.license_type || ''} onChange={(event) => setArtworkForm({ ...artworkForm, license_type: event.target.value })} placeholder="CC BY, comercial, autorização" /></label>
                <label className="block text-sm font-medium">Fonte da licença<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" type="url" value={artworkForm.license_source_url || ''} onChange={(event) => setArtworkForm({ ...artworkForm, license_source_url: event.target.value })} /></label>
              </div>
              <label className="block text-sm font-medium">Notas da licença<textarea className="mt-1 w-full rounded-lg border border-gray-300 p-3" rows={3} value={artworkForm.license_notes || ''} onChange={(event) => setArtworkForm({ ...artworkForm, license_notes: event.target.value })} /></label>
              <label className="block text-sm font-medium">Links de referência<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.civitai_url || ''} onChange={(event) => setArtworkForm({ ...artworkForm, civitai_url: event.target.value })} placeholder="URL Civitai" /></label>
              <label className="block text-sm font-medium">Link Leonardo<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.leonardo_url || ''} onChange={(event) => setArtworkForm({ ...artworkForm, leonardo_url: event.target.value })} /></label>
              <label className="flex items-center gap-2 text-sm font-medium"><input checked={artworkForm.credit_required} onChange={(event) => setArtworkForm({ ...artworkForm, credit_required: event.target.checked })} type="checkbox" /> Exige crédito</label>
              {artworkForm.credit_required && <label className="block text-sm font-medium">Texto do crédito<input className="mt-1 w-full rounded-lg border border-gray-300 p-3" value={artworkForm.credit_text || ''} onChange={(event) => setArtworkForm({ ...artworkForm, credit_text: event.target.value })} required /></label>}
              <label className="flex items-center gap-2 text-sm font-medium"><input checked={artworkForm.published} disabled={artworkForm.license_status !== 'approved'} onChange={(event) => setArtworkForm({ ...artworkForm, published: event.target.checked })} type="checkbox" /> Publicar no catálogo</label>
              <div className="flex gap-3">
                <button className="rounded-lg bg-gray-900 px-4 py-3 font-bold text-white disabled:opacity-50" disabled={isSaving} type="submit">{isSaving ? 'Salvando...' : 'Salvar obra'}</button>
                {editingArtworkId && <button className="rounded-lg border border-gray-300 px-4 py-3 font-bold" onClick={resetArtworkForm} type="button">Cancelar</button>}
              </div>
            </form>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-display">Obras</h2>
            <button className="text-sm font-bold text-brand-primary" onClick={resetArtworkForm} type="button">Nova obra</button>
          </div>
          {artworks.length === 0 ? <p className="text-gray-500">Nenhuma obra cadastrada.</p> : <div className="divide-y divide-gray-100">{artworks.map((artwork) => <article className="flex items-center justify-between gap-4 py-4" key={artwork.id}><div className="flex min-w-0 items-center gap-4"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">{artwork.final_image_url && <img className="h-full w-full object-cover" src={artwork.final_image_url} alt="" />}</div><div className="min-w-0"><h3 className="truncate font-bold">{artwork.title}</h3><p className="text-sm text-gray-500">/{artwork.slug} · {artwork.orientation === 'a3-wide' ? 'A3 wide' : 'A3 vertical'} · licença {artwork.license_status} · {artwork.published ? 'publicada' : 'rascunho'}</p></div></div><div className="flex shrink-0 gap-3 text-sm"><button className="font-bold text-brand-primary" onClick={() => startEditingArtwork(artwork)} type="button">Editar</button><button className="font-bold text-red-600" onClick={() => void deleteArtwork(artwork.id)} type="button">Excluir</button></div></article>)}</div>}
        </section>
      </div>
    </main>
  )
}
