import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { Button as RetroButton } from '@/components/retroui/Button'
import { buttonVariants } from '@/components/ui/button-styles'

type LinkButtonProps = LinkProps & {
  className?: string
  size?: 'default' | 'sm'
  variant?: 'danger' | 'ghost' | 'primary' | 'secondary' | 'success' | 'warning'
}

export function LinkButton({ className, size, variant, ...props }: LinkButtonProps) {
  return (
    <RetroButton
      asChild
      className={buttonVariants({ className, size, variant })}
      size={size === 'sm' ? 'sm' : 'md'}
      variant={variant === 'secondary' || variant === 'ghost' ? variant : 'default'}
    >
      <Link {...props} />
    </RetroButton>
  )
}
