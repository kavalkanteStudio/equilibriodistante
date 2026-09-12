import { useCart } from '@/context/CartContext'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-brand-primary hover:underline mb-8 inline-block">
          ← Back to Store
        </Link>

        <h1 className="text-4xl font-display font-bold mb-8">Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
            <Link to="/" className="text-brand-primary font-bold hover:underline">
              Return to Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="p-6 border rounded-2xl">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" />
                    <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg" />
                    <input type="text" placeholder="Shipping Address" className="w-full p-3 border rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" className="w-full p-3 border rounded-lg" />
                      <input type="text" placeholder="Zip Code" className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-6 border rounded-2xl bg-gray-50 h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.variantId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title} ({item.size}) x{item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between items-center mb-6">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-brand-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all"
                onClick={() => {
                  alert('Payment integration coming next! Your order has been simulated.')
                  clearCart()
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
