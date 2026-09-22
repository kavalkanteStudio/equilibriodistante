import { Link } from 'react-router-dom'
import { ShoppingBag, Menu } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function Header() {
  const { cart, setCartOpen } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header onMouseLeave={closeMenu} className="sticky top-0 z-40 w-full border-b bg-brand-septenary/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-gray-900 text-xl tracking-tight">
            SKOPPOVIC
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-tertiary">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <Link to="/coleções" className="hover:text-brand-primary transition-colors">Coleções</Link>
            <Link to="/sobre" className="hover:text-brand-primary transition-colors">Sobre</Link>
            <Link to="/contato" className="hover:text-brand-primary transition-colors">Contato</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative p-2 text-brand-tertiary hover:text-brand-primary transition-colors"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="md:hidden p-2 text-brand-tertiary">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      {isMenuOpen &&
        <div className="absolute top-12 right-4 bg-brand-primary font-medium shadow-lg rounded-lg p-4">
          <Link to="/" className="block py-2 text-white hover:text-brand-secondary transition-colors">Home</Link>
          <Link to="/coleções" className="block py-2 text-white hover:text-brand-secondary transition-colors">Coleções</Link>
          <Link to="/sobre" className="block py-2 text-white hover:text-brand-secondary transition-colors">Sobre</Link>
          <Link to="/contato" className="block py-2 text-white hover:text-brand-secondary transition-colors">Contato</Link>
        </div>
      }
    </header>
  )
}
