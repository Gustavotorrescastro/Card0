type EdenredLogoProps = {
  compact?: boolean
  className?: string
}

export default function EdenredLogo({
  compact = false,
  className = '',
}: EdenredLogoProps) {
  const size = compact ? 'h-12 w-12 text-[15px]' : 'h-[52px] w-[52px] text-[16px]'

  return (
    <div
      className={`${size} ${className} flex shrink-0 items-center justify-center rounded-full bg-[#ff2b1d] font-black text-white`}
      aria-label="Edenred"
    >
      Edenred
    </div>
  )
}
