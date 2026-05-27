import Link from 'next/link'
import { Camera, Play, X } from 'lucide-react'

import EdenredLogo from './EdenredLogo'

export default function AuthFooter() {
  return (
    <footer className="w-full border-t border-[#7aa1b7] bg-[#2d2d2d] px-10 py-12 text-[#d7d7d7]">
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1fr_220px_160px]">
        <div>
          <EdenredLogo />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold uppercase">Site Global</h2>
          <Link href="#" className="text-lg hover:text-white">
            Site Global da Edenred
          </Link>
        </div>

        <div className="space-y-5">
          <h2 className="text-lg font-semibold uppercase">Acompanhe</h2>
          <div className="flex items-center gap-5">
            <Link href="#" aria-label="YouTube" className="hover:text-white">
              <Play size={18} fill="currentColor" strokeWidth={0} />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-white">
              <Camera size={18} />
            </Link>
            <Link href="#" aria-label="X" className="hover:text-white">
              <X size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
