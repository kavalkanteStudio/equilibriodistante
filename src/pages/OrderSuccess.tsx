import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import SEO from '@/components/SEO'

export default function OrderSuccess() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-white flex items-center justify-center">
      <SEO title="Order Confirmed" description="Thank you for your order! We will contact you soon." />
      <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-3xl bg-gray-50">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-4xl font-display font-bold">Pedido Confirmado!</h1>
        <p className="text-lg text-gray-600">
          Agradecemos seu tempo para fazer o pedido! Em breve, entraremos em contato para confirmar os detalhes. O pagamento é realizado na entrega.
        </p>
        <div className="pt-8">
          <Link
            to="/"
            className="inline-block w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  )
}
