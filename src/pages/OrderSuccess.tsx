import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function OrderSuccess() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-white flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-3xl bg-gray-50">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-4xl font-display font-bold">Order Confirmed!</h1>
        <p className="text-lg text-gray-600">
          Thank you for your request. We have received your order and will contact you shortly via email to confirm details and arrange payment.
        </p>
        <div className="pt-8">
          <Link
            to="/"
            className="inline-block w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    </div>
  )
}
