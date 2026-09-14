import { Link } from 'react-router-dom'
import { ShoppingBag, Menu } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { cart, setCartOpen } = useCart()
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display font-bold text-xl tracking-tight">
            SKOPPOVIC
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-brand-primary transition-colors">Gallery</Link>
            <Link to="/collections" className="hover:text-brand-primary transition-colors">Collections</Link>
            <Link to="/about" className="hover:text-brand-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-brand-primary transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative p-2 text-gray-600 hover:text-brand-primary transition-colors"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
