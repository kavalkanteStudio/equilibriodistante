import { Mail, User, MessageCircle, LucideSend } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-septenary">
      <SEO title="Contato SKOPPOVIC" description="Fale com a SKOPPOVIC. Estamos aqui para ouvir você, inclusive secretamente. Retornamos emails durante as manhâs de segunda à sexta. Mande uma dúvida sobre uma peça ou faça uma encomenda ou solicitação personalizada." />
      {/* Page Header */}
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl">Contato</h1>
          <div className="w-24 h-1 bg-brand-primary mx-auto" />
          <p className="text-lg text-brand-tertiary max-w-md mx-auto font-light">
            Mande uma dúvida sobre uma peça ou faça uma encomenda e solicitação personalizada.
          </p>
          <p className="mt-10! p-4 bg-brand-senary border border-brand-primary rounded-2xl text-sm text-brand-primary max-w-xl mx-auto font-medium text-center">
            Retornamos Emails durante as Manhãs de Segunda à Sexta.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-16 mb-16">
        <div className="bg-brand-septenary min-w-sm p-8 border rounded-3xl shadow-sm">
          <form className="container mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="min-w-sm max-w-md flex-1 space-y-8">
              <div className="container mx-auto px-4 text-center space-y-4 flex flex-col items-center justify-center">
                <h3 className="text-xl md:text-3xl font-bold">Fale<br/>com<br/>a<br/>SKOPPOVIC</h3>
                <p className="max-w-2xl text-lg text-brand-tertiary mx-auto font-light mb-6!">
                  Estamos aqui para ouvir você, inclusive secretamente.
                </p>
                <div className="w-24 h-1 bg-brand-secondary mx-auto" />
              </div>

              <div>
                <label className="hidden text-sm font-medium text-gray-700 mb-2">Nome</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-senary text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <input type="text" className="w-full p-3 border-b rounded-none focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Simplesmente Joana" />
                  </div>
                </div>
              </div>

              <div>
                <label className="hidden text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-senary text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <input type="email" className="w-full p-3 border-b rounded-none focus:ring-2 focus:ring-brand-primary outline-none" placeholder="joana@email.com" />
                  </div>
                </div>
              </div>

              <div>
                <label className="hidden text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand-senary text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
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
                    <button className="bg-brand-primary hover:bg-brand-secondary px-4 py-2 rounded-full text-white flex items-center justify-self-start gap-3">
                      <LucideSend className="w-6 h-6" />
                      <span className="font-bold">Mandar mensagem</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="p-3 invisible">
                    <LucideSend className="w-6 h-6" />
                  </div>
                  <div className="w-full text-sm font-light">
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
