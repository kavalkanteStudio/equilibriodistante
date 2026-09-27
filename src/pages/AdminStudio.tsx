import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Sparkles, Save, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button, Input, Textarea, Label } from '@/components/ui'

export default function AdminStudio() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('3:4')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [syncToStorage, setSyncToStorage] = useState(true)
  const [artwork, setArtwork] = useState<Artwork[]>([])

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

  function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message || fallback
    }

    return fallback
  }

  async function handleGenerate() {
    if (!prompt) return
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const { data, error: funcError } = await supabase.functions.invoke('generate-artwork', {
        body: { prompt, aspect_ratio: aspectRatio },
      })

      if (funcError) throw funcError

      if (data?.output && Array.isArray(data.output)) {
        setGeneratedImage(data.output[0])
      } else if (data?.output) {
        setGeneratedImage(data.output)
      } else {
        throw new Error('Image is still processing. Please try again in a few seconds.')
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'An unexpected error occurred'))
    } finally {
      setIsGenerating(false)
    }
  }

  async function promoteToCatalog() {
    if (!generatedImage || !prompt) return
    setIsSaving(true)
    setError(null)

    try {
      const { data: artwork, error: artError } = await supabase
        .from('artworks')
        .insert({
          title: prompt.slice(0, 50) + '...',
          slug: prompt.slice(0, 30).toLowerCase().replace(/\s+/g, '-'),
          prompt_summary: prompt,
          source_model: 'Flux Schnell',
          source_tool: 'Flux Schnell',
          source_url: generatedImage,
          final_image_url: generatedImage,
          license_type: 'Apache-2.0',
          license_source_url: 'https://replicate.com/black-forest-labs/flux-schnell',
          license_notes: 'Licença Apache-2.0. Permite uso comercial, modificação e distribuição, desde que os avisos de direitos autorais e a licença original sejam preservados. Os outputs gerados por este modelo são de propriedade do usuário.',
          orientation:
            aspectRatio === '1:1'
              ? 'a3-vertical'
              : aspectRatio === '16:9'
                ? 'a3-wide'
                : aspectRatio === '9:16'
                  ? 'a3-vertical'
                  : 'a3-vertical',
          published: false,
          license_status: 'pending',
        })
        .select()
        .single()

      if (artError) throw artError
      if (artwork) setArtwork([artwork])

      if (syncToStorage && artwork) {
        const { data: syncData, error: syncError } = await supabase.functions.invoke('import-artwork-image', {
          body: { source_url: generatedImage, artwork_id: artwork.id },
        })

        if (syncError) {
          console.error('Sync error:', syncError)
          // We don't throw here because the artwork was already created
          alert('Obra promovida, mas a sincronização da imagem para o storage falhou. Você pode sincronizá-la manualmente no Dashboard.')
        } else {
          alert('Obra promovida e imagem salva permanentemente no storage!')
        }
      } else {
        alert('Obra promovida ao catálogo com sucesso! Nota: A imagem ainda está hospedada no Replicate e pode expirar.')
      }

      setGeneratedImage(null)
      setPrompt('')
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'An unexpected error occurred'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-septenary p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-2">
          <div className="w-full flex items-center justify-between gap-2 text-brand-secondary">
            <span className="flex gap-1">
              <Sparkles className="w-5 h-5" />
              <p className="text-sm font-bold uppercase tracking-widest">AI Creation Studio</p>
            </span>
            <span className="flex gap-1">
              <Button variant="secondary" onClick={() => (window.location.href = '/')} type="button">
                Home
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/admin')}
                type="button"
              >
                Dashboard
              </Button>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display">Flux Schnell Lab</h1>
          <p className="text-brand-tertiary">Gere uma imagem, publique e edite depois.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6 bg-brand-septenary p-6 rounded-2xl border border-brand-secondary shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Criativo</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: A minimalist golden cat silhouette with a vintage twist, luxury background..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-30 resize-y text-brand-tertiary required:text-brand-primary placeholder:text-brand-primary"
                  required
                />
                <Input className="hidden" />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20">
                <input
                  id="sync-storage"
                  type="checkbox"
                  checked={syncToStorage}
                  onChange={(e) => setSyncToStorage(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary"
                />
                <Label htmlFor="sync-storage" className="text-xs font-bold cursor-pointer">
                  Salvar imagem permanentemente no Storage (Recomendado)
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Proporção da Imagem</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['1:1', '3:4', '9:16', '16:9'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        aspectRatio === ratio
                          ? 'bg-brand-primary text-brand-octonary border-brand-quaternary'
                          : 'bg-brand-septenary text-brand-tertiary hover:text-brand-octonary border-brand-tertiary hover:bg-brand-primary'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full flex flex-1 px-4 py-2 font-bold gap-2 bg-brand-primary hover:bg-brand-secondary text-brand-septenary"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" /> Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles /> Gerar Obra
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-septenary text-brand-secondary text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col gap-4">
            <div
              className={`relative w-full overflow-hidden rounded-2xl bg-brand-secondary/20 border-2 border-dashed border-brand-secondary transition-all ${
                aspectRatio === '1:1'
                  ? 'aspect-square'
                  : aspectRatio === '16:9'
                    ? 'aspect-video'
                    : 'aspect-3/4'
              }`}
            >
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated Art"
                  className="h-full w-full object-cover animate-in fade-in duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-secondary gap-2">
                  <ImageIcon className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-medium">Aguardando criação...</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
                </div>
              )}
            </div>
            <div>
              {artwork.length === 0 ? (
                <p className="text-brand-tertiary hidden">Aguardando Criação.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {artwork.map((artwork) => (
                    <article
                      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-brand-secondary p-3"
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
                            {artwork.orientation === 'a3-wide' ? 'A3 wide' : 'A3 vertical'} ·
                            licença {artwork.license_status} ·{' '}
                            {artwork.published ? 'publicada' : 'rascunho'}
                          </p>
                          <p className="text-xs uppercase font-medium text-brand-secondary">
                            {artwork.collections?.name || 'Sem coleção'}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {generatedImage && (
                <Button
                  className="w-full flex flex-1 px-4 py-2 font-bold gap-2 bg-brand-primary hover:bg-brand-secondary text-brand-septenary"
                  onClick={promoteToCatalog}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Save /> Promover ao Catálogo
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
