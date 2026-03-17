import { retroButtonVariants } from '@/components/retroui/button-variants'
import { cn } from '@/lib/utils'

type ButtonSize = 'default' | 'sm'
type ButtonVariant = 'danger' | 'ghost' | 'primary' | 'secondary' | 'success' | 'warning'

const sizeMap: Record<ButtonSize, 'md' | 'sm'> = {
  default: 'md',
  sm: 'sm',
}

const variantMap: Record<ButtonVariant, 'default' | 'ghost' | 'secondary'> = {
  danger: 'default',
  ghost: 'ghost',
  primary: 'default',
  secondary: 'secondary',
  success: 'default',
  warning: 'secondary',
}

const variantClassMap: Record<ButtonVariant, string> = {
  danger: 'bg-[var(--retro-danger)] text-[var(--destructive-foreground)] hover:brightness-110',
  ghost: '',
  primary: '',
  secondary: '',
  success: 'bg-[var(--retro-success)] text-white hover:brightness-110',
  warning: 'bg-[var(--retro-warning)] text-white hover:brightness-110',
}

export function buttonVariants({
  className,
  size = 'default',
  variant = 'primary',
}: {
  className?: string
  size?: ButtonSize
  variant?: ButtonVariant
} = {}) {
  return cn(
    retroButtonVariants({
      size: sizeMap[size],
      variant: variantMap[variant],
    }),
    'justify-center uppercase tracking-[0.14em]',
    size === 'default' ? 'min-h-12' : '',
    variantClassMap[variant],
    className,
  )
}
