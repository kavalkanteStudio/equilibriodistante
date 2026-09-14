import { Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import Layout from '@/components/Layout'
import Home from './pages/Home'
import CollectionDetail from './pages/CollectionDetail'
import ArtworkDetail from './pages/ArtworkDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import About from './pages/About'
import Contact from './pages/Contact'
import Collections from './pages/Collections'
import './App.css'

function App() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background text-foreground">
        <CartDrawer />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collection/:slug" element={<CollectionDetail />} />
            <Route path="/artwork/:slug" element={<ArtworkDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </main>
    </CartProvider>
  )
}

export default App
