import { Mail, User, MessageCircle, LucideSend } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <SEO title="Contact Us" description="Get in touch with SKOPPOVIC for inquiries or custom decorative art requests." />
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl">Contato</h1>
        <div className="w-20 h-1 bg-brand-primary mx-auto" />
        <p className="text-lg text-gray-600">Estamos aqui para ouvir você. Seja uma dúvida sobre uma peça ou uma solicitação personalizada.</p>
      </div>

      <div className="flex flex-col items-center gap-16">
        <div className="bg-white p-8 border rounded-3xl shadow-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col items-center justify-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" placeholder="John Doe" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <input type="email" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" placeholder="John Doe" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <textarea rows={4} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" placeholder="John Doe"></textarea>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <LucideSend className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <button className="w-fit px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all">
                      Enviar Mensagem
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
