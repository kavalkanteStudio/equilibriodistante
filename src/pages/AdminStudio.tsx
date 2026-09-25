import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Sparkles, Save, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button, Input, Textarea, Label } from '@/components/ui'

export default function AdminStudio() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

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
        throw new Error("Image is still processing. Please try again in a few seconds.")
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
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
          source_tool: 'Replicate',
          source_url: generatedImage,
          final_image_url: generatedImage,
          orientation: aspectRatio === '1:1' ? 'a3-vertical' : (aspectRatio === '16:9' ? 'a3-wide' : 'a3-vertical'),
          published: false,
          license_status: 'pending',
        })
        .select()
        .single()

      if (artError) throw artError

      alert('Obra promovida ao catálogo com sucesso! Agora você pode editá-la no Dashboard.')
      setGeneratedImage(null)
      setPrompt('')
    } catch (err: any) {
      setError(err.message || 'Error promoting to catalog')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-septenary p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-secondary">
            <Sparkles className="w-5 h-5" />
            <p className="text-sm font-bold uppercase tracking-widest">AI Creation Studio</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-display">Flux Schnell Lab</h1>
          <p className="text-brand-tertiary">Transforme palavras em arte comercial de alta qualidade.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Criativo</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: A minimalist golden cat silhouette with a vintage twist, luxury background..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Proporção da Imagem</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['1:1', '3:4', '16:9'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        aspectRatio === ratio
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-brand-secondary'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full py-6 text-lg font-bold gap-2"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <><Loader2 className="animate-spin" /> Gerando...</>
                ) : (
                  <><Sparkles /> Gerar Obra</>
                )}
              </Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col gap-4">
            <div
              className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 transition-all ${
                aspectRatio === '1:1' ? 'aspect-square' : (aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[3/4]')
              }`}
            >
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated Art"
                  className="h-full w-full object-cover animate-in fade-in duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
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

            {generatedImage && (
              <Button
                className="w-full py-6 text-lg font-bold gap-2 bg-gray-900 hover:bg-black text-white"
                onClick={promoteToCatalog}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 className="animate-spin" /> Salvando...</>
                ) : (
                  <><Save /> Promover ao Catálogo</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
