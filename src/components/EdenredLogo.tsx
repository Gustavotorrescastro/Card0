import Image from 'next/image'

import logoEdenred from '../../LogoEdenred.png'

type EdenredLogoProps = {
  compact?: boolean
  className?: string
}

export default function EdenredLogo({
  compact = false,
  className = '',
}: EdenredLogoProps) {
  const size = compact ? 'h-10 w-20' : 'h-12 w-24'

  return (
    <Image
      src={logoEdenred}
      alt="Edenred"
      className={`${size} ${className} object-contain`}
      priority
    />
  )
}
