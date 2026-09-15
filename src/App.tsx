import { Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import Layout from '@/components/Layout'
import Home from './pages/Home'
import CollectionDetail from './pages/CollectionDetail'
import CraftedArtworkDetail from './pages/CraftedArtworkDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import About from './pages/About'
import Contact from './pages/Contact'
import Collections from './pages/Collections'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import './App.css'

function App() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background text-foreground">
        <CartDrawer />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/coleções" element={<Collections />} />
            <Route path="/coleção/:slug" element={<CollectionDetail />} />
            <Route path="/obra/:slug" element={<CraftedArtworkDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido-sucesso" element={<OrderSuccess />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
          </Route>
        </Routes>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </CartProvider>
  )
}

export default App
