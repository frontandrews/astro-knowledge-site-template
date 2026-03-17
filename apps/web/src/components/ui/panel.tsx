import type { HTMLAttributes } from 'react'

import { Card } from '@/components/retroui/Card'
import { cn } from '@/lib/utils'

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  inset?: boolean
}

export function Panel({ className, inset = false, ...props }: PanelProps) {
  return (
    <Card
      className={cn(
        'block rounded-[1.6rem] border-[var(--retro-line-strong)] bg-[var(--retro-surface)] shadow-lg',
        inset &&
          'bg-[var(--retro-surface-muted)] shadow-[inset_0_0_0_2px_var(--retro-line),var(--shadow-lg)]',
        className,
      )}
      {...props}
    />
  )
}
