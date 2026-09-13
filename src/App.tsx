import { Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import Home from './pages/Home'
import CollectionDetail from './pages/CollectionDetail'
import ArtworkDetail from './pages/ArtworkDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import './App.css'

function App() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background text-foreground">
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection/:slug" element={<CollectionDetail />} />
          <Route path="/artwork/:slug" element={<ArtworkDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </main>
    </CartProvider>
  )
}

export default App
