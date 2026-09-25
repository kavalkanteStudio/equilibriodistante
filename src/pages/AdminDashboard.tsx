import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import ImageUploadField from '@/components/ImageUploadField'
import { slugify } from '@/lib/utils'
import { Pencil, Trash2, ClipboardPlus } from 'lucide-react'
import { Button, Input, Textarea, Label, Select } from '@/components/ui'

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
  collections: { name: string } | null
  title: string
  slug: string
  prompt_summary: string | null
  workflow_description: string | null
  source_url: string | null
  license_notes: string | null
  source_model: string | null
  source_tool: string | null
  source_plan: string | null
  license_status: 'pending' | 'approved' | 'rejected'
  license_type: string | null
  license_source_url: string | null
  license_verified_at: string | null
  credit_required: boolean
  credit_text: string | null
  orientation: 'a3-vertical' | 'a3-wide'
  final_image_url: string | null
  published: boolean
}

type ArtworkForm = Omit<Artwork, 'id'>

type ArtworkOrigin = 'leonardo' | 'civitai'

type LicensePreset = {
  label: string
  source_tool: string
  license_type: string
  license_source_url: string
  license_notes: string
}

const licensePresets: Record<ArtworkOrigin, LicensePreset> = {
  leonardo: {
    label: 'Leonardo AI',
    source_tool: 'Leonardo AI',
    license_type: 'Royalty-Free - CreativeML OpenRAIL-M',
    license_source_url: 'https://leonardo.ai/pricing',
    license_notes:
      'Derivada de Stable Diffusion (que usa CreativeML OpenRAIL-M), mas os fine-tunes e pesos do Leonardo são fechados. Regido pelo plano: pago → você detém propriedade intelectual total; gratuito → Leonardo detém os direitos e te dá uma licença não-exclusiva e royalty-free para uso comercial',
  },
  civitai: {
    label: 'Civitai / Krea 2',
    source_tool: 'Civitai',
    license_type: 'Krea 2 Community License Agreement',
    license_source_url: 'https://www.krea.ai/krea-2-licensing',
    license_notes:
      'Este registro considera um modelo base Krea 2 ou um LoRA derivado do Krea 2 obtido no Civitai. A licença aplicável é a Krea 2 Community License Agreement, não CreativeML ou Apache. O uso comercial é permitido somente enquanto a receita anual da empresa e afiliadas for inferior a US$ 1.000.000 e houver menos de 50 assentos; acima desses limites, é necessária uma Enterprise License da Krea. Os outputs pertencem ao usuário, sem reivindicação de propriedade intelectual pela Krea. É obrigatório implementar filtro de conteúdo ou processo de revisão equivalente. A distribuição de um LoRA derivado exige transmitir a licença aos receptores e manter o aviso de atribuição. Confirmar também as licenças separadas de VAE, CLIP e demais componentes antes de publicar.',
  },
}

type ProductVariant = {
  id?: string
  name: string
  sku: string
  stock_quantity: number
}

type Product = {
  id: string
  artwork_id: string
  product_type: string
  title: string
  description: string | null
  base_price: number
  active: boolean
  product_variants: ProductVariant[]
}

type ProductForm = Omit<Product, 'id' | 'base_price' | 'product_variants'> & {
  base_price: string
  product_variants: ProductVariant[]
}

type AdminTab = 'collections' | 'artworks' | 'products'

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
  source_url: '',
  license_notes: '',
  source_model: '',
  source_tool: '',
  source_plan: '',
  license_status: 'pending',
  license_type: '',
  license_source_url: '',
  license_verified_at: null,
  credit_required: false,
  credit_text: '',
  orientation: 'a3-vertical',
  final_image_url: '',
  published: false,
}

const emptyProductForm: ProductForm = {
  artwork_id: '',
  product_type: 'print',
  title: '',
  description: '',
  base_price: '0',
  active: true,
  product_variants: [{ name: '', sku: '', stock_quantity: 0 }],
}

export default function AdminDashboard() {
  const { session, signOut } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<CollectionForm>(emptyForm)
  const [artworkForm, setArtworkForm] = useState<ArtworkForm>(emptyArtworkForm)
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [artworkOrigin, setArtworkOrigin] = useState<ArtworkOrigin>('leonardo')
  const [artworkSlugTouched, setArtworkSlugTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>('artworks')

  async function loadCollections() {
    setIsLoading(true)
    const { data, error: queryError } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })
    if (queryError) setError(queryError.message)
    else setCollections(data as Collection[])
    setIsLoading(false)
  }

  async function loadArtworks() {
    const { data, error: queryError } = await supabase
      .from('artworks')
      .select(`
        *,
        collections ( name )
      `)
      .order('created_at', { ascending: false })

    if (queryError) setError(queryError.message)
    else setArtworks((data || []) as Artwork[])
  }

  async function loadProducts() {
    const { data, error: queryError } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .order('created_at', { ascending: false })
    if (queryError) setError(queryError.message)
    else setProducts((data || []) as Product[])
  }

  // Start Loading Data
  const [sload, setSload] = useState(false)
  setTimeout(() => setSload(true),100)
  useEffect(() => {
    if (sload) {
      void Promise.resolve().then(() =>
        Promise.all([loadCollections(), loadArtworks(), loadProducts()]),
      )
    }
  }, [sload])

  function scrollToForm(id: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

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
    scrollToForm('collection-form')
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
  }

  function startEditingArtwork(artwork: Artwork) {
    setEditingArtworkId(artwork.id)
    setArtworkSlugTouched(true)
    setArtworkOrigin(artwork.source_tool?.toLowerCase().includes('civitai') ? 'civitai' : 'leonardo')
    setArtworkForm({
      collection_id: artwork.collection_id || '',
      title: artwork.title,
      slug: artwork.slug,
      prompt_summary: artwork.prompt_summary || '',
      workflow_description: artwork.workflow_description || '',
      source_url: artwork.source_url || '',
      license_notes: artwork.license_notes || '',
      source_model: artwork.source_model || '',
      source_tool: artwork.source_tool || '',
      source_plan: artwork.source_plan || '',
      license_status: artwork.license_status,
      license_type: artwork.license_type || '',
      license_source_url: artwork.license_source_url || '',
      license_verified_at: artwork.license_verified_at,
      credit_required: artwork.credit_required,
      credit_text: artwork.credit_text || '',
      orientation: artwork.orientation,
      final_image_url: artwork.final_image_url || '',
      published: artwork.published,
    })
    setError(null)
    scrollToForm('artwork-form')
  }

  function resetArtworkForm() {
    setEditingArtworkId(null)
    setArtworkSlugTouched(false)
    setArtworkOrigin('leonardo')
    setArtworkForm(emptyArtworkForm)
    setError(null)
  }

  function applyLicensePreset() {
    const preset = licensePresets[artworkOrigin]
    setArtworkForm({
      ...artworkForm,
      source_tool: preset.source_tool,
      license_type: preset.license_type,
      license_source_url: preset.license_source_url,
      license_notes: preset.license_notes,
      license_status: 'pending',
      published: false,
    })
    setError(null)
  }

  function startEditingProduct(product: Product) {
    setEditingProductId(product.id)
    setProductForm({
      artwork_id: product.artwork_id,
      product_type: product.product_type,
      title: product.title,
      description: product.description || '',
      base_price: String(product.base_price),
      active: product.active,
      product_variants: product.product_variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        stock_quantity: Number(variant.stock_quantity),
      })),
    })
    setError(null)
    scrollToForm('product-form')
  }

  function resetProductForm() {
    setEditingProductId(null)
    setProductForm(emptyProductForm)
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
      source_url: artworkForm.source_url || null,
      license_notes: artworkForm.license_notes || null,
      source_model: artworkForm.source_model || null,
      source_tool: artworkForm.source_tool || null,
      source_plan: artworkForm.source_plan || null,
      license_type: artworkForm.license_type || null,
      license_source_url: artworkForm.license_source_url || null,
      license_verified_at:
        artworkForm.license_status === 'approved'
          ? artworkForm.license_verified_at || new Date().toISOString()
          : null,
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

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    if (!productForm.artwork_id) {
      setError('Selecione uma obra para o produto.')
      setIsSaving(false)
      return
    }

    const price = Number(String(productForm.base_price).replace(',', '.'))
    if (!Number.isFinite(price) || price < 0) {
      setError('Informe um preço numérico válido para o produto.')
      setIsSaving(false)
      return
    }

    if (
      productForm.product_variants.length === 0 ||
      productForm.product_variants.some(
        (variant) => !variant.name.trim() || !variant.sku.trim() || variant.stock_quantity < 0,
      )
    ) {
      setError('Cada variante precisa de nome, SKU e estoque válido.')
      setIsSaving(false)
      return
    }

    const productPayload = {
      artwork_id: productForm.artwork_id,
      product_type: productForm.product_type,
      title: productForm.title,
      description: productForm.description || null,
      base_price: price,
      active: productForm.active,
    }
    const productResult = editingProductId
      ? await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProductId)
          .select('id')
          .single()
      : await supabase.from('products').insert(productPayload).select('id').single()

    if (productResult.error || !productResult.data) {
      setError(productResult.error?.message || 'Não foi possível salvar o produto.')
      setIsSaving(false)
      return
    }

    const productId = productResult.data.id
    if (editingProductId) {
      const { error: deleteVariantsError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId)
      if (deleteVariantsError) {
        setError(deleteVariantsError.message)
        setIsSaving(false)
        return
      }
    }

    const variantsResult = await supabase.from('product_variants').insert(
      productForm.product_variants.map((variant) => ({
        product_id: productId,
        name: variant.name.trim(),
        sku: variant.sku,
        stock_quantity: variant.stock_quantity,
      })),
    )

    if (variantsResult.error) setError(variantsResult.error.message)
    else {
      resetProductForm()
      await loadProducts()
    }
    setIsSaving(false)
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('Excluir este produto e suas variantes?')) return
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else await loadProducts()
  }

  return (
    <main className="min-h-screen bg-brand-septenary p-4 md:p-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
              Skoppovic CMS
            </p>
            <h1 className="text-2xl md:text-4xl">Catálogo</h1>
            <p className="text-sm text-brand-tertiary">{session?.user.email}</p>
          </div>
          <span className="flex gap-1">

            <Button
              variant="secondary"
              onClick={() => window.location.href = "/"}
              type="button"
            >
              Home
            </Button>
            <Button
              variant="secondary"
              onClick={() => void signOut()}
              type="button"
            >
              Logout
            </Button>
        </span>
        </header>

        <nav
          aria-label="Seções do catálogo"
          className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-brand-septenary p-1 shadow-sm"
        >
          {([
            ['collections', 'Coleções', collections.length],
            ['artworks', 'Obras', artworks.length],
            ['products', 'Produtos', products.length],
          ] as const).map(([tab, label, count]) => (
            <button
              aria-selected={activeTab === tab}
              className={`rounded-lg px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-900/50 hover:bg-brand-secondary/10 border border-transparent hover:border hover:border-brand-secondary hover:text-gray-900/70'
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              {label}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab ? 'bg-brand-primary text-white' : 'bg-gray-900/50 text-white'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </nav>

        {/* Tab Coleções*/}
        {activeTab === 'collections' && (
        <>
          <section className="rounded-2xl border border-gray-200 bg-brand-septenary p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-display">Coleções</h2>
              <Button
                variant="ghost"
                onClick={() => {
                  resetForm()
                  scrollToForm('collection-form')
                }}
                type="button"
              >
                <ClipboardPlus />
              </Button>
            </div>
            {isLoading ? (
              <p className="text-brand-tertiary">Carregando...</p>
            ) : collections.length === 0 ? (
              <p className="text-brand-tertiary">Nenhuma coleção cadastrada.</p>
            ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                {collections.map((collection) => (
                  <article
                        className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"
                    key={collection.id}
                  >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-brand-secondary">
                            {collection.cover_image && (
                              <img
                                className="h-full w-full object-cover"
                                src={collection.cover_image}
                                alt=""
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold">{collection.name}</h3>
                            <p className="truncate text-xs text-brand-tertiary">
                            /{collection.slug} · {collection.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            aria-label={`Editar coleção ${collection.name}`}
                            onClick={() => startEditing(collection)}
                            title="Editar coleção"
                            type="button"
                          >
                            <Pencil aria-hidden="true" size={15} />
                          </Button>
                          <Button
                            variant="danger"
                            aria-label={`Excluir coleção ${collection.name}`}
                            onClick={() => void deleteCollection(collection.id)}
                            title="Excluir coleção"
                            type="button"
                          >
                            <Trash2 aria-hidden="true" size={15} />
                          </Button>
                        </div>
                  </article>
                ))}
                  </div>
                )}
          </section>

          <section className="scroll-mt-6 rounded-2xl border border-gray-200 bg-brand-septenary p-6 shadow-sm" id="collection-form">
            <h2 className="mb-5 text-2xl font-display">
              {editingId ? 'Editar coleção' : 'Nova coleção'}
            </h2>
            <form className="space-y-4" onSubmit={saveCollection}>
              <Label>
                Nome
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </Label>
              <Label>
                Slug
                <Input
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  required
                />
              </Label>
              <Label>
                Descrição
                <Textarea
                  rows={4}
                  value={form.description || ''}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </Label>
              <div>
                <Label>Capa da coleção</Label>
                <ImageUploadField
                  value={form.cover_image || ''}
                  onChange={(coverImage) => setForm({ ...form, cover_image: coverImage })}
                  pathPrefix={`collections/${editingId || 'pending'}`}
                  disabled={!editingId}
                />
                {!editingId && (
                  <p className="mt-2 text-xs text-brand-tertiary">
                    Salve a coleção primeiro para habilitar o upload.
                  </p>
                )}
                <Label className="mt-3">
                  Ou cole uma URL direta
                  <Input
                    type="url"
                    value={form.cover_image || ''}
                    onChange={(event) => setForm({ ...form, cover_image: event.target.value })}
                  />
                </Label>
              </div>
              <Label>
                Status
                <Select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </Select>
              </Label>
              {error && <p className="text-sm text-brand-tertiary">{error}</p>}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                {editingId && (
                  <Button
                    variant="secondary"
                    onClick={resetForm}
                    type="button"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </section>
        </>
        )}

        {/* Tab Obras*/}
        {activeTab === 'artworks' && (
        <>
        <section className="rounded-2xl border border-gray-200 bg-brand-septenary p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-display">Obras</h2>
            <Button
              variant="ghost"
              onClick={() => {
                resetArtworkForm()
                scrollToForm('artwork-form')
              }}
              type="button"
            >
              <ClipboardPlus />
            </Button>
          </div>
          {artworks.length === 0 ? (
            <p className="text-brand-tertiary">Nenhuma obra cadastrada.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {artworks.map((artwork) => (
                <article
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"
                  key={artwork.id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-secondary">
                      {artwork.final_image_url && (
                        <img
                          className="h-full w-full object-cover"
                          src={artwork.final_image_url}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold">{artwork.title}</h3>
                      <p className="truncate text-xs text-brand-tertiary">
                        /{artwork.slug} ·{' '}
                        {artwork.orientation === 'a3-wide' ? 'A3 wide' : 'A3 vertical'} · licença{' '}
                        {artwork.license_status} · {artwork.published ? 'publicada' : 'rascunho'}
                      </p>
                      <p className="text-xs uppercase font-medium text-brand-secondary">
                        {artwork.collections.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      aria-label={`Editar obra ${artwork.title}`}
                      onClick={() => startEditingArtwork(artwork)}
                      title="Editar obra"
                      type="button"
                    >
                      <Pencil aria-hidden="true" size={15} />
                    </Button>
                    <Button
                      variant="danger"
                      aria-label={`Excluir obra ${artwork.title}`}
                      onClick={() => void deleteArtwork(artwork.id)}
                      title="Excluir obra"
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={15} />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
          </section>

          <section className="scroll-mt-6 rounded-2xl border border-gray-200 bg-brand-septenary p-6 shadow-sm" id="artwork-form">
            <h2 className="mb-5! text-2xl font-display">
              {editingArtworkId ? 'Editar obra' : 'Nova obra'}
            </h2>
            <form className="space-y-4" onSubmit={saveArtwork}>
              <Label>Origem do artwork</Label>
              <div className="rounded-xl border-2 border-dashed border-brand-secondary/50 bg-brand-secondary/5 hover:border-brand-secondary/70 hover:bg-brand-secondary/10 p-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Label className="flex items-center">
                    <Select
                      value={artworkOrigin}
                      onChange={(event) => setArtworkOrigin(event.target.value as ArtworkOrigin)}
                    >
                      {Object.entries(licensePresets).map(([origin, preset]) => (
                        <option key={origin} value={origin}>
                          {preset.label}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Button
                    variant="primary"
                    onClick={applyLicensePreset}
                    type="button"
                  >
                    Aplicar preset de licença
                  </Button>
                </div>
                <p className="p-1 text-xs text-brand-primary">
                  Ferramenta, Tipo, Fonte, Licença. Revise antes de salvar.
                </p>
              </div>
              <div>
                <Label>Imagem final</Label>
                <ImageUploadField
                  value={artworkForm.final_image_url || ''}
                  onChange={(finalImageUrl) =>
                    setArtworkForm({ ...artworkForm, final_image_url: finalImageUrl })
                  }
                  pathPrefix={`artworks/${editingArtworkId || 'pending'}`}
                  disabled={false}
                />
                <Label className="mt-3">
                  Ou cole uma URL direta
                  <Input
                    type="url"
                    value={artworkForm.final_image_url || ''}
                    onChange={(event) =>
                      setArtworkForm({ ...artworkForm, final_image_url: event.target.value })
                    }
                  />
                </Label>
              </div>
              <Label>
                Resumo do prompt
                <Textarea
                  rows={3}
                  value={artworkForm.prompt_summary || ''}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, prompt_summary: event.target.value })
                  }
                />
              </Label>
              <Label>
                Descrição do workflow
                <Textarea
                  rows={3}
                  value={artworkForm.workflow_description || ''}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, workflow_description: event.target.value })
                  }
                />
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Label>
                  Ferramenta
                  <Input
                    value={artworkForm.source_tool || ''}
                    onChange={(event) =>
                      setArtworkForm({ ...artworkForm, source_tool: event.target.value })
                    }
                    placeholder="Leonardo AI"
                  />
                </Label>
                <Label>
                  Modelo
                  <Input
                    value={artworkForm.source_model || ''}
                    onChange={(event) =>
                      setArtworkForm({ ...artworkForm, source_model: event.target.value })
                    }
                  />
                </Label>
              </div>
              <Label>
                Plano utilizado
                <Input
                  value={artworkForm.source_plan || ''}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, source_plan: event.target.value })
                  }
                  placeholder="Pago, gratuito ou licença do modelo"
                />
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Label>
                  Tipo de licença
                  <Input
                    value={artworkForm.license_type || ''}
                    onChange={(event) =>
                      setArtworkForm({ ...artworkForm, license_type: event.target.value })
                    }
                    placeholder="CC BY, comercial, autorização"
                  />
                </Label>
                <Label>
                  Fonte da licença
                  <Input
                    type="url"
                    value={artworkForm.license_source_url || ''}
                    onChange={(event) =>
                      setArtworkForm({ ...artworkForm, license_source_url: event.target.value })
                    }
                  />
                </Label>
              </div>
              <Label>
                Notas da licença
                <Textarea
                  rows={3}
                  value={artworkForm.license_notes || ''}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, license_notes: event.target.value })
                  }
                />
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Label>
                  Orientação
                  <Select
                    value={artworkForm.orientation}
                    onChange={(event) =>
                      setArtworkForm({
                        ...artworkForm,
                        orientation: event.target.value as ArtworkForm['orientation'],
                      })
                    }
                  >
                    <option value="a3-vertical">A3 vertical (30x45)</option>
                    <option value="a3-wide">A3 wide (45x30)</option>
                  </Select>
                </Label>
                <Label>
                  Revisão da licença
                  <Select
                    value={artworkForm.license_status}
                    onChange={(event) =>
                      setArtworkForm({
                        ...artworkForm,
                        license_status: event.target.value as ArtworkForm['license_status'],
                        published: false,
                      })
                    }
                  >
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovada</option>
                    <option value="rejected">Rejeitada</option>
                  </Select>
                </Label>
              </div>
              <Label>
                Link da página oficial
                <Input
                  type="url"
                  value={artworkForm.source_url || ''}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, source_url: event.target.value })
                  }
                  placeholder="URL da fonte (Civitai, Leonardo, Replicate, etc)"
                />
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  checked={artworkForm.credit_required}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, credit_required: event.target.checked })
                  }
                  type="checkbox"
                />{' '}
                Exige crédito
              </Label>
              {artworkForm.credit_required && (
                <Label>
                  Texto do crédito
                  <Input
                    value={artworkForm.credit_text || 'Créditos: Usuàrio @'}
                    onChange={(event) =>
                      setArtworkForm({ ...artworkForm, credit_text: event.target.value })
                    }
                    required
                  />
                </Label>
              )}
              <Label>
                Título
                <Input
                  value={artworkForm.title}
                  onChange={(event) => {
                    const title = event.target.value
                    setArtworkForm({
                      ...artworkForm,
                      title,
                      ...(artworkHulgTouched ? {} : { slug: slugify(title) }),
                    })
                  }}
                  required
                />
              </Label>
              <Label>
                Slug
                <Input
                  value={artworkForm.slug}
                  onChange={(event) => {
                    setArtworkSlugTouched(true)
                    setArtworkForm({ ...artworkForm, slug: event.target.value })
                  }}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  required
                />
              </Label>
              <Label>
                Coleção
                <Select
                  value={artworkForm.collection_id || ''}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, collection_id: event.target.value })
                  }
                >
                  <option value="">Sem coleção</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  checked={artworkForm.published}
                  disabled={artworkForm.license_status !== 'approved'}
                  onChange={(event) =>
                    setArtworkForm({ ...artworkForm, published: event.target.checked })
                  }
                  type="checkbox"
                />{' '}
                Publicar no catálogo
              </Label>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? 'Salvando...' : 'Salvar obra'}
                </Button>
                {editingArtworkId && (
                  <Button
                    variant="secondary"
                    onClick={resetArtworkForm}
                    type="button"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </section>
          </>
        )}

        {/* Tab Produtos */}
        {activeTab === 'products' && (
          <>
            <section className="rounded-2xl border border-gray-200 bg-brand-septenary p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-display">Produtos</h2>
            <Button
              variant="ghost"
              onClick={() => {
                resetProductForm()
                scrollToForm('product-form')
              }}
              type="button"
            >
              <ClipboardPlus />
            </Button>
          </div>
          {products.length === 0 ? (
            <p className="text-brand-tertiary">Nenhum produto cadastrado.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {products.map((product) => {
                const artwork = artworks.find((item) => item.id === product.artwork_id)
                return (
                  <article
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"
                    key={product.id}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-secondary">
                        {artwork?.final_image_url && (
                          <img
                            className="h-full w-full object-cover"
                            src={artwork.final_image_url}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold">{product.title}</h3>
                        <p className="truncate text-xs text-brand-tertiary">
                          {artwork?.title || 'Obra removida'} ·{' '}
                          {product.product_variants.map((variant) => variant.name).join(' / ')} ·{' '}
                          {product.active ? 'ativo' : 'inativo'}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        aria-label={`Editar produto ${product.title}`}
                        onClick={() => startEditingProduct(product)}
                        title="Editar produto"
                        type="button"
                      >
                        <Pencil aria-hidden="true" size={15} />
                      </Button>
                      <Button
                        variant="danger"
                        aria-label={`Excluir produto ${product.title}`}
                        onClick={() => void deleteProduct(product.id)}
                        title="Excluir produto"
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={15} />
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
            </section>

            <section className="scroll-mt-6 rounded-2xl border border-gray-200 bg-brand-septenary p-6 shadow-sm" id="product-form">
          <h2 className="mb-5 text-2xl font-display">
            {editingProductId ? 'Editar produto' : 'Novo produto'}
          </h2>
          <form className="space-y-4" onSubmit={saveProduct}>
            <Label>
              Obra
              <Select
                value={productForm.artwork_id}
                onChange={(event) =>
                  setProductForm({ ...productForm, artwork_id: event.target.value })
                }
              >
                <option value="">Selecione uma obra</option>
                {artworks
                  .filter((artwork) => artwork.published)
                  .map((artwork) => (
                    <option key={artwork.id} value={artwork.id}>
                      {artwork.title}
                    </option>
                  ))}
              </Select>
            </Label>
            <Label>
              Título
              <Input
                value={productForm.title}
                onChange={(event) => setProductForm({ ...productForm, title: event.target.value })}
                required
              />
            </Label>
            <Label>
              Tipo
              <Select
                value={productForm.product_type}
                onChange={(event) =>
                  setProductForm({ ...productForm, product_type: event.target.value })
                }
              >
                <option value="print">Impressão</option>
                <option value="canvas">Tela</option>
                <option value="poster">Pôster</option>
              </Select>
            </Label>
            <Label>
              Descrição
              <Textarea
                rows={3}
                value={productForm.description || ''}
                onChange={(event) =>
                  setProductForm({ ...productForm, description: event.target.value })
                }
              />
            </Label>
            <Label>
              Preço
              <Input
                inputMode="decimal"
                value={productForm.base_price}
                onChange={(event) =>
                  setProductForm({ ...productForm, base_price: event.target.value })
                }
                placeholder="79,90"
                required
              />
            </Label>
            <div className="space-y-3">
              <div className="mt-16 flex items-center justify-between">
                <p className="font-bold">Variantes</p>
                <button
                  className="text-sm font-bold text-brand-tertiary"
                  onClick={() =>
                    setProductForm({
                      ...productForm,
                      product_variants: [
                        ...productForm.product_variants,
                        { name: '', sku: '', stock_quantity: 0 },
                      ],
                    })
                  }
                  type="button"
                >
                  Adicionar variante
                </button>
              </div>
              {productForm.product_variants.map((variant, index) => (
                <div
                  className="rounded-lg border border-gray-200 p-3"
                  key={variant.id || `new-${index}`}
                >
                  <div className="mb-2 flex items-center justify-center gap-3">
                    <p className="text-sm font-medium">Variante {index + 1}</p>
                    {productForm.product_variants.length > 1 && (
                      <button
                        className="text-sm font-bold text-brand-tertiary"
                        onClick={() =>
                          setProductForm({
                            ...productForm,
                            product_variants: productForm.product_variants.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          })
                        }
                        type="button"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Input
                      placeholder="Nome da variante (ex.: A3 vertical 30x45 aprox.)"
                      value={variant.name}
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          product_variants: productForm.product_variants.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, name: event.target.value } : item,
                          ),
                        })
                      }
                      required
                    />
                    <Input
                      placeholder="SKU (ex.: SKU-0001A3V)"
                      value={variant.sku}
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          product_variants: productForm.product_variants.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, sku: event.target.value } : item,
                          ),
                        })
                      }
                      required
                    />
                    <Label className="text-sm font-medium">Estoque</Label>
                    <Input
                      min="0"
                      type="number"
                      placeholder="Estoque"
                      value={variant.stock_quantity}
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          product_variants: productForm.product_variants.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, stock_quantity: Number(event.target.value) }
                              : item,
                          ),
                        })
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            <Label className="flex items-center gap-2">
              <input
                checked={productForm.active}
                onChange={(event) =>
                  setProductForm({ ...productForm, active: event.target.checked })
                }
                type="checkbox"
              />{' '}
              Produto ativo
            </Label>
            <div className="flex gap-3">
              <Button
                variant="primary"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Salvando...' : 'Salvar produto'}
              </Button>
              {editingProductId && (
                <Button
                  variant="secondary"
                  onClick={resetProductForm}
                  type="button"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
