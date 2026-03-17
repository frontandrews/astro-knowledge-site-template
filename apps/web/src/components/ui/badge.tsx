import type { HTMLAttributes } from 'react'

import { Badge as RetroBadge } from '@/components/retroui/Badge'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'accent' | 'danger' | 'success' | 'warning'
}

const toneMap: Record<
  NonNullable<BadgeProps['tone']>,
  { className: string; variant: 'default' | 'outline' | 'solid' | 'surface' }
> = {
  accent: {
    className:
      'bg-[var(--retro-accent-soft)] text-[var(--retro-ink)] outline-[var(--retro-line-strong)]',
    variant: 'surface',
  },
  danger: {
    className:
      'bg-[color:rgba(180,87,116,0.22)] text-[var(--retro-ink)] outline-[var(--retro-danger)]',
    variant: 'outline',
  },
  default: {
    className:
      'bg-[color:rgba(255,255,255,0.06)] text-[var(--retro-ink)] outline-[var(--retro-line)]',
    variant: 'outline',
  },
  success: {
    className:
      'bg-[color:rgba(95,138,164,0.22)] text-[var(--retro-ink)] outline-[var(--retro-success)]',
    variant: 'outline',
  },
  warning: {
    className:
      'bg-[color:rgba(122,145,181,0.22)] text-[var(--retro-ink)] outline-[var(--retro-warning)]',
    variant: 'outline',
  },
}

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  const config = toneMap[tone]

  return (
    <RetroBadge
      className={[
        'inline-flex items-center uppercase tracking-[0.18em]',
        config.className,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      size="sm"
      variant={config.variant}
      {...props}
    />
  )
}
