import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function signInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) setError(signInError.message)
    else navigate((location.state as { from?: string } | null)?.from || '/admin', { replace: true })
    setIsLoading(false)
  }

  async function signInWithGitHub() {
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/admin` },
    })
    if (signInError) setError(signInError.message)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-600">Skoppovic</p>
        <h1 className="mb-2 text-4xl font-display">Administração</h1>
        <p className="mb-8 text-gray-500">Entre para gerenciar o catálogo.</p>

        <form className="space-y-4" onSubmit={signInWithPassword}>
          <label className="block text-sm font-medium text-gray-700">
            E-mail
            <input className="mt-1 w-full rounded-lg border border-gray-300 p-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Senha
            <input className="mt-1 w-full rounded-lg border border-gray-300 p-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-lg bg-gray-900 px-4 py-3 font-bold text-white disabled:opacity-50" disabled={isLoading} type="submit">
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 font-bold text-gray-700" onClick={signInWithGitHub} type="button">
          Entrar com GitHub
        </button>
      </section>
    </main>
  )
}
