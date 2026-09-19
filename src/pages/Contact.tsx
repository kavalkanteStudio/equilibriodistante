import { Mail, User, MessageCircle, LucideSend } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SEO title="Contact Us" description="Get in touch with SKOPPOVIC for inquiries or custom decorative art requests." />
      {/* Page Header */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl">Contato</h1>
          <div className="w-24 h-1 bg-brand-primary mx-auto" />
          <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
            Retornamos emails durante as manhâs de segunda à sexta. 
          </p>
          <p className="text-lg text-gray-600 max-w-96 mx-auto font-light">
            Mande uma dúvida sobre uma peça ou faça uma solicitação personalizada.  
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-16 mb-16">
        <div className="bg-white min-w-sm p-8 border rounded-3xl shadow-sm">
          <form className="container mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="min-w-sm max-w-md flex-1 space-y-8">
              <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
                <h3 className="text-xl md:text-3xl mb-0!">Mensagem</h3>
                <p className="max-w-96 text-lg text-gray-600 max-w-2xl mx-auto font-light mb-6!">
                  Estamos aqui para ouvir você, inclusive secretamente.
                </p>
                <div className="w-24 h-1 bg-brand-secondary mx-auto" />
              </div>

              <div>
                <label className="block hidden text-sm font-medium text-gray-700 mb-2">Nome</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <input type="text" className="w-full p-3 border-b rounded-none focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Simplesmente Joana" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block hidden text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <input type="email" className="w-full p-3 border-b rounded-none focus:ring-2 focus:ring-brand-primary outline-none" placeholder="joana@email.com" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block hidden text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <textarea rows={4} className="w-full p-3 border-b rounded-none focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Bom dia! Quero encomendar um presente de aniversário para o meu filho João..."></textarea>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="p-3 invisible">
                    <LucideSend className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <button className="bg-brand-primary hover:bg-brand-secondary px-4 py-2 rounded-full text-white text-lg w-full flex items-center gap-3">
                      <LucideSend className="w-6 h-6" />
                      <span className="font-bold">Enviar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="p-3 invisible">
                    <LucideSend className="w-6 h-6" />
                  </div>
                  <div className="w-full text-sm text-center font-light">
                    (DADOS e SOLICITAÇÕES são CONFIDENCIAIS)
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
