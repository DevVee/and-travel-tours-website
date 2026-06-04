import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  asChild?: boolean
  href?: string
}

const variantStyles = {
  primary:   'bg-brand-orange text-white hover:bg-orange-600 shadow-orange',
  secondary: 'bg-brand-black text-white hover:bg-neutral-800',
  ghost:     'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
  outline:   'border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer select-none whitespace-nowrap',
    variantStyles[variant],
    sizeStyles[size],
    className
  )

  if (href) {
    // If it's an anchor link (#section), use smooth scroll for mobile compatibility
    const handleClick = href.startsWith('#') ? (e: React.MouseEvent) => {
      e.preventDefault()
      const id = href.slice(1)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } : undefined

    return (
      <motion.a
        href={href}
        onClick={handleClick}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  )
}
