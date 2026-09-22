import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Settings, X } from 'lucide-react'

type ThemeKey = 'boutique' | 'trend' | 'editorial' | 'original'

type ThemePreset = {
  label: string
  description: string
  swatches: string[]
  colors: Record<string, string>
}

const themePresets: Record<ThemeKey, ThemePreset> = {
  boutique: {
    label: 'Indigo',
    description: 'Blue, pink, chocolate',
    swatches: [
      '#7209b7', 
      '#f72585', 
      '#a53860', 
      '#a53860', 
      '#fdf0d5', 
      '#faedcd', 
      '#f0f0eb', 
      '#cbeef3'
    ],
    colors: {
      '--color-brand-primary': '#7209b7',
      '--color-brand-secondary': '#f72585',
      '--color-brand-tertiary': '#a53860',
      '--color-brand-quaternary': '#a53860',
      '--color-brand-quinary': '#fdf0d5',
      '--color-brand-senary': '#faedcd',
      '--color-brand-septenary': '#f0f0eb',
      '--color-brand-octonary': '#cbeef3',
    },
  },
  trend: {
    label: 'West',
    description: 'Contemporâneo, clean, vibrante',
    swatches: [
      '#b57b5a',
      '#e7d6c5',
      '#8a6d73',
      '#1b1b1b',
      '#f7f1ea',
      '#f1e7df',
      '#f5f3ef',
      '#c78a72',
    ],
    colors: {
      '--color-brand-primary': '#b57b5a',
      '--color-brand-secondary': '#e7d6c5',
      '--color-brand-tertiary': '#8a6d73',
      '--color-brand-quaternary': '#1b1b1b',
      '--color-brand-quinary': '#f7f1ea',
      '--color-brand-senary': '#f1e7df',
      '--color-brand-septenary': '#f5f3ef',
      '--color-brand-octonary': '#c78a72',
    },
  },
  editorial: {
    label: 'Editorial',
    description: 'Contraste intenso e neutralidade.',
    swatches: [
      '#8a695d',
      '#d5b8a4',
      '#c7a88d',
      '#121212',
      '#f2efe9',
      '#e8ddd3',
      '#f7f5f1',
      '#6d4f46',
    ],
    colors: {
      '--color-brand-primary': '#8a695d',
      '--color-brand-secondary': '#d5b8a4',
      '--color-brand-tertiary': '#c7a88d',
      '--color-brand-quaternary': '#121212',
      '--color-brand-quinary': '#f2efe9',
      '--color-brand-senary': '#e8ddd3',
      '--color-brand-septenary': '#f7f5f1',
      '--color-brand-octonary': '#6d4f46',
    },
  },
  original: {
    label: 'Original',
    description: 'Marcante e vibrante.',
    swatches: [
      '#ff3b3b',
      '#ffb800',
      '#6b6375',
      '#111827',
      '#f4f0e9',
      '#f2e9e4',
      '#f0f0eb',
      '#a47864',
    ],
    colors: {
      '--color-brand-primary': '#ff3b3b',
      '--color-brand-secondary': '#ffb800',
      '--color-brand-tertiary': '#6b6375',
      '--color-brand-quaternary': '#111827',
      '--color-brand-quinary': '#f4f0e9',
      '--color-brand-senary': '#f2e9e4',
      '--color-brand-septenary': '#f0f0eb',
      '--color-brand-octonary': '#a47864',
    },
  },
}

const STORAGE_KEY = 'skoppovic-theme-preset'

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('boutique')
  const activePreset = themePresets[activeTheme]

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null

    if (savedTheme && themePresets[savedTheme]) {
      setActiveTheme(savedTheme)
      return
    }

    const preset = themePresets.boutique
    Object.entries(preset.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }, [])

  useEffect(() => {
    const preset = themePresets[activeTheme]

    Object.entries(preset.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })

    window.localStorage.setItem(STORAGE_KEY, activeTheme)
  }, [activeTheme])

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-septenary/45 px-4 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-[28px] border border-brand-quinary bg-gradient-to-br from-brand-septenary via-white to-brand-quinary p-5 shadow-[0_30px_80px_rgba(17,24,39,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-brand-primary">
              Personalização
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-brand-quaternary">
              Tema & Cor
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full border border-brand-quinary bg-white/80 p-2 text-brand-tertiary transition-colors hover:border-brand-primary hover:text-brand-primary"
            aria-label="Fechar ajustes"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5! max-w-lg text-sm leading-relaxed text-brand-tertiary">
          Escolha uma paleta. Selecione o tema que mais gostar.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.entries(themePresets) as [ThemeKey, ThemePreset][]).map(([key, preset]) => {
            const isSelected = activeTheme === key

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTheme(key)
                  setIsOpen(false)
                }}
                className={[
                  'rounded-2xl border p-3 text-left transition-all duration-200',
                  isSelected
                    ? 'border-brand-primary bg-white shadow-[0_12px_26px_rgba(164,120,100,0.18)] ring-1 ring-brand-primary/40'
                    : 'border-brand-quinary bg-white/55 hover:border-brand-secondary hover:bg-white/80',
                ].join(' ')}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    {preset.swatches.map((color) => (
                      <span
                        key={`${key}-${color}`}
                        className="h-4 w-4 rounded-full border border-black/5"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {isSelected && (
                    <span className="rounded-full bg-brand-primary/10 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-brand-primary">
                      Ativo
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-brand-quaternary">{preset.label}</p>
                  <p className="text-xs leading-relaxed text-brand-tertiary">{preset.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        type="button"
        aria-label="Abrir ajustes de tema"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-brand-quinary bg-white/60 px-2.5 py-2 text-brand-tertiary shadow-sm transition-all hover:border-brand-primary hover:text-brand-primary"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-quinary text-brand-quaternary">
          <Settings className="h-4 w-4" />
        </span>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] sm:inline">
          {activePreset.label}
        </span>
      </button>

      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  )
}
