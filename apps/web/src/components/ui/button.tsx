import type { ButtonHTMLAttributes } from 'react'

import { Button as RetroButton } from '@/components/retroui/Button'
import { buttonVariants } from '@/components/ui/button-styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'default' | 'sm'
  variant?: 'danger' | 'ghost' | 'primary' | 'secondary' | 'success' | 'warning'
}

export function Button({ className, size, variant, ...props }: ButtonProps) {
  return (
    <RetroButton
      className={buttonVariants({ className, size, variant })}
      size={size === 'sm' ? 'sm' : 'md'}
      variant={variant === 'secondary' || variant === 'ghost' ? variant : 'default'}
      {...props}
    />
  )
}
