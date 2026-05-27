import Image from 'next/image'

import card0Logo from '../../card0.png'

type Card0LogoProps = {
  className?: string
  priority?: boolean
}

export default function Card0Logo({
  className = 'h-8 w-auto',
  priority = false,
}: Card0LogoProps) {
  return (
    <Image
      src={card0Logo}
      alt="Card0"
      className={className}
      priority={priority}
    />
  )
}
