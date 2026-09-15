import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { ImagePlus, UploadCloud } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type ImageUploadFieldProps = {
  value: string
  onChange: (value: string) => void
  pathPrefix: string
  disabled?: boolean
}

const MAX_FILE_SIZE = 12 * 1024 * 1024
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploadField({ value, onChange, pathPrefix, disabled = false }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File) {
    setError(null)
    if (!acceptedTypes.includes(file.type)) {
      setError('Use uma imagem JPEG, PNG ou WebP.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('A imagem deve ter no máximo 12 MB.')
      return
    }

    setIsUploading(true)
    const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
    const path = `${pathPrefix}/${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('artworks').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      setError(uploadError.message)
    } else {
      const { data } = supabase.storage.from('artworks').getPublicUrl(path)
      onChange(data.publicUrl)
    }
    setIsUploading(false)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) void uploadFile(file)
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) void uploadFile(file)
  }

  return (
    <div>
      <button
        className={`relative flex min-h-40 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-4 text-center transition-colors ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-300 bg-gray-50 hover:border-brand-primary'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
        onDragLeave={(event) => { event.preventDefault(); setIsDragging(false) }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        type="button"
      >
        {value ? <img className="absolute inset-0 h-full w-full object-cover opacity-30" src={value} alt="Pré-visualização da capa" /> : null}
        <span className="relative z-10 rounded-full bg-white/90 p-3 text-brand-primary shadow-sm">
          {isUploading ? <UploadCloud className="animate-pulse" size={24} /> : <ImagePlus size={24} />}
        </span>
        <span className="relative z-10 mt-3 text-sm font-bold text-gray-700">{isUploading ? 'Enviando imagem...' : 'Arraste a imagem ou clique para selecionar'}</span>
        <span className="relative z-10 mt-1 text-xs text-gray-500">JPEG, PNG ou WebP · até 12 MB</span>
      </button>
      <input ref={inputRef} accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleInputChange} type="file" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
