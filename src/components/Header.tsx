import Link from 'next/link'
import React,{ReactNode} from 'react'
interface HeaderProps{
  children?: ReactNode
}

const Header=({children}:HeaderProps):React.JSX.Element=>{
  return(
    <header className="bg-edenred-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-edenred-light transition-colors">
            Card0 - Edenred
          </Link>
          <nav className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/simulador-risco-operacional" className="text-sm font-medium hover:text-edenred-light transition-colors">
              Simulador de Risco
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-edenred-light transition-colors border border-white px-3 py-1 rounded-md hover:bg-white hover:text-edenred-primary">
              Login
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </header>
  )
}
export default Header