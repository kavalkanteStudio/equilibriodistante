import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-senary border-t py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-xl text-brand-tertiary">SKOPPOVIC</h3>
            <p className="text-brand-quaternary">
              Arte Decorativa de Baixo Custo.
            </p>
            <div className="flex mt-4 gap-4 text-brand-tertiary">
              <a href="/contato" className="hover:text-brand-quaternary transition-colors">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="/contato" className="hover:text-brand-quaternary transition-colors">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
              </a>
              <a href="/contato" className="hover:text-brand-quaternary transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-brand-tertiary">
              <li><Link to="/" className="text-brand-quaternary hover:text-brand-primary transition-colors">Home</Link></li>
              <li><Link to="/coleções" className="text-brand-quaternary hover:text-brand-primary transition-colors">Coleções</Link></li>
              <li><Link to="/sobre" className="text-brand-quaternary hover:text-brand-primary transition-colors">Sobre</Link></li>
              <li><Link to="/contato" className="text-brand-quaternary hover:text-brand-primary transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-brand-tertiary">
              <li><Link to="/entregas" className="text-brand-quaternary hover:text-brand-primary transition-colors">As Entregas</Link></li>
              <li><Link to="/privacidade" className="text-brand-quaternary hover:text-brand-primary transition-colors">Sua Privacidade</Link></li>
              <li><Link to="/acordos" className="text-brand-quaternary hover:text-brand-primary transition-colors">Acordos Comerciais</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-tertiary">
          <p>© {new Date().getFullYear()} CC BY SKOPPOVIC. Licença livre para uso pessoal.</p>
          <p>Artesanato e Arte Digital.</p>
        </div>
      </div>
    </footer>
  )
}
