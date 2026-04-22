import Link from 'next/link'
import React,{ReactNode} from 'react'
interface FooterProps{
  children?: ReactNode
}

const Footer=({children}:FooterProps):React.JSX.Element=>{
  return(
    <footer className="bg-gray-900 text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm">© 2026 Card0 - Edenred. Todos os direitos reservados.</p>
          </div>
          <nav className="flex space-x-4 text-center md:text-right">
            <Link href="/termos" className="text-sm hover:text-brand-primary transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-sm hover:text-brand-primary transition-colors">
              Política de Privacidade
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
export default Footer
