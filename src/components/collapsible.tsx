import { Button } from '@/components/ui/button';
import { PropsWithChildren, useState } from 'react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface CollapsibleProps {
  id?: string | number
  title?: string
  subtitle?: string
  titleSize?: 'md' | 'lg'
  defaultCollapsed?: boolean
}

export function Collapsible({ title, subtitle, titleSize = 'md', children, defaultCollapsed, ...props }: CollapsibleProps & PropsWithChildren) {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed ?? true)

  if (!title) return children

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        layout
        key={props.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} 
      >
        <Button 
          className={clsx('flex max-w-max items-center gap-1 px-2 py-1', {
            'px-2 py-1': titleSize === 'lg'
          })}
          variant={collapsed ? 'ghost' : 'ghost-active'} 
          onClick={() => setCollapsed(!collapsed)}
        >
          <Icon
            icon='material-symbols:keyboard-arrow-down-rounded' 
            className={clsx('rotate-0 text-2xl transition-transform', {
              '!-rotate-90': collapsed,
            })} 
          />
          <span 
            className={clsx('font-semibold', {
              'text-2xl': titleSize === 'lg'
            })}
          >
            { title }
          </span>
          <span 
            className={clsx('px-1 font-semibold text-muted-foreground', {
              'text-2xl': titleSize === 'lg'
            })}
          >
            { subtitle }
          </span>
        </Button>
      </motion.div>
      <div className="overflow-hidden">
        <AnimatePresence mode='wait'>
          {!collapsed && (
            <motion.div
              key={props.id + 'wrapper'}
              layoutRoot
              initial={{ opacity: 0, translateY: '-50%' }}
              animate={{ opacity: 1, translateY: '0%' }}
              transition={{
                opacity: { duration: .35, ease: 'circInOut' },
                duration: 0.3,
                type: 'spring'
              }}
              exit={{ opacity: 0, translateY: '-50%' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
