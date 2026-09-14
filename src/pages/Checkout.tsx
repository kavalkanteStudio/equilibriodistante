import { useCart } from '@/context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import SEO from '@/components/SEO'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Shipping address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  })

  async function onPlaceOrder(data: CheckoutFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Create the order
      // We store the customer details in shipping_reference as JSON since the schema is minimal
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          status: 'pending',
          total_amount: totalPrice,
          shipping_reference: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            address: data.address,
            city: data.city,
            zipCode: data.zipCode,
          }),
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Success
      clearCart()
      navigate('/order-success')
    } catch (err: any) {
      console.error('Order error:', err)
      setError(err.message || 'Something went wrong while placing your order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <SEO title="Checkout" description="Complete your order and secure your piece of digital art." />
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
                <form className="space-y-4" onSubmit={handleSubmit(onPlaceOrder)}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        {...register('fullName')}
                        type="text"
                        placeholder="Full Name"
                        className={`w-full p-3 border rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="Email Address"
                        className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <input
                        {...register('address')}
                        type="text"
                        placeholder="Shipping Address"
                        className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : ''}`}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          {...register('city')}
                          type="text"
                          placeholder="City"
                          className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : ''}`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <input
                          {...register('zipCode')}
                          type="text"
                          placeholder="Zip Code"
                          className={`w-full p-3 border rounded-lg ${errors.zipCode ? 'border-red-500' : ''}`}
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                      </div>
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

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <button
                disabled={isLoading}
                className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                onClick={handleSubmit(onPlaceOrder)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
