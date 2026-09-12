import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart()

  return (
    <>
      {/* Cart Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-brand-primary text-white rounded-full shadow-2xl hover:bg-brand-secondary transition-all hover:scale-110 group"
      >
        <ShoppingBag size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-brand-primary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-brand-primary">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Your Cart</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <ShoppingBag size={64} className="mb-4 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                  <Link to="/" className="mt-4 text-brand-primary font-bold hover:underline">
                    Start exploring art
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.variantId} className="flex gap-4 p-3 border rounded-xl">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <button onClick={() => removeFromCart(item.variantId)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Size: {item.size}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-gray-100 border-r"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-gray-100 border-l"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-brand-primary text-white text-center font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
