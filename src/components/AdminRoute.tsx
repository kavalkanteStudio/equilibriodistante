import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AdminRoute() {
  const { session, isAdmin, isLoading, signOut } = useAuth()
  const location = useLocation()

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-septenary p-6">
        <section className="max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <h1 className="mb-3 text-2xl font-display">Acesso administrativo necessário</h1>
          <p className="mb-6 text-sm text-red-800">A sessão está ativa, mas ainda não possui o papel admin. Saia e entre novamente depois de atualizar o papel no Supabase.</p>
          <button className="rounded-lg bg-gray-900 px-4 py-3 font-bold text-white" onClick={() => void signOut()} type="button">Sair</button>
        </section>
      </main>
    )
  }

  return <Outlet />
}
