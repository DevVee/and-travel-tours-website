/**
 * BrandLogo
 * Priority 1: /public/logo.png  — put your logo file at public/logo.png
 * Priority 2: SVG recreation of the A + orange plane swoosh logo
 */

interface BrandLogoProps {
  height?: number
  variant?: 'dark' | 'light'
  className?: string
  scrolled?: boolean
  onError?: () => void
}

// SVG recreation of the actual A N D Travel logo:
// Big bold "A" + orange speed lines + orange airplane swoosh + "TRAVEL AND TOURS"
function LogoSVG({ variant, height }: { variant: 'dark' | 'light'; height: number }) {
  const letterFill = variant === 'dark' ? '#111111' : '#ffffff'
  const textFill   = variant === 'dark' ? '#111111' : '#ffffff'
  const w = Math.round(height * 1.05)

  return (
    <svg
      viewBox="0 0 210 185"
      width={w}
      height={height}
      aria-label="A N D Travel and Tours"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* ── Large bold "A" ─────────────────────────── */}
      <text
        x="105"
        y="148"
        textAnchor="middle"
        fontFamily="'Arial Black','Impact','sans-serif'"
        fontWeight="900"
        fontSize="175"
        fill={letterFill}
      >
        A
      </text>

      {/* ── Speed lines — left side ──────────────────── */}
      <path d="M34 124 Q19 106 27 83" stroke="#F97316" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M25 139 Q6 116 17 89"  stroke="#F97316" strokeWidth="3"   fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M17 153 Q-8 124 5 94"  stroke="#F97316" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.45"/>

      {/* ── Orange airplane — upper right, tilted -38° ─ */}
      <g transform="translate(162,46) rotate(-38)">
        {/* Fuselage */}
        <ellipse cx="0" cy="0" rx="28" ry="6.5" fill="#F97316"/>
        {/* Main wing */}
        <polygon points="-7,-6.5 15,-6.5 7,-26 -2,-14" fill="#F97316"/>
        {/* Tail wing */}
        <polygon points="-21,-2.5 -12,-2.5 -18,-13 -24,-9" fill="#F97316"/>
        {/* Nose cone */}
        <polygon points="25,-2 25,2 36,0" fill="#F97316"/>
      </g>

      {/* ── "TRAVEL AND TOURS" ───────────────────────── */}
      <text
        x="105"
        y="175"
        textAnchor="middle"
        fontFamily="'Arial','Helvetica',sans-serif"
        fontWeight="700"
        fontSize="15"
        letterSpacing="2.5"
        fill={textFill}
      >
        TRAVEL AND TOURS
      </text>
    </svg>
  )
}

export function BrandLogo({ height = 52, variant = 'dark', className = '', scrolled = false, onError }: BrandLogoProps) {
  const displayHeight = scrolled ? Math.round(height * 0.72) : height

  return (
    <div className={`relative inline-flex items-center transition-all duration-300 ${className}`} style={{ height: displayHeight }}>
      {/* Try actual logo image first */}
      <img
        src="/logo.png"
        alt="A N D Travel and Tours Logo"
        height={displayHeight}
        style={{ height: displayHeight, width: 'auto', display: 'block' }}
        className={`transition-all duration-300 drop-shadow-sm ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        onError={(e) => {
          // Hide image, show SVG fallback
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          const svgWrapper = e.currentTarget.nextElementSibling as HTMLElement | null
          if (svgWrapper) svgWrapper.style.display = 'block'
          onError?.()
        }}
      />
      {/* SVG fallback — hidden by default, shown if logo.png fails */}
      <span style={{ display: 'none' }}>
        <LogoSVG variant={variant} height={displayHeight} />
      </span>
    </div>
  )
}

/** Standalone fallback (used in Footer where no state needed) */
export function FallbackLogo({ scrolled = false, variant = 'dark' }: { scrolled?: boolean; variant?: 'dark' | 'light' }) {
  const h = scrolled ? 36 : 52
  return <LogoSVG variant={variant} height={h} />
}
