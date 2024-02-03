import { Button } from '@/components/ui/button';
import { PropsWithChildren, useState } from 'react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface CollapsibleProps {
  title?: string
  titleSize?: 'md' | 'lg'
  defaultCollapsed?: boolean
}

export function Collapsible({ title, titleSize = 'md', children, defaultCollapsed }: CollapsibleProps & PropsWithChildren) {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed ?? true)

  if (!title) return children

  return (
    <div className="flex flex-col gap-4">
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
        >{ title }</span>
      </Button>
      <div className='overflow-hidden'>
        <AnimatePresence mode='wait'>
          {!collapsed && (
            <motion.div
              key={title}
              layout
              initial={{ opacity: 0, translateY: '-50%' }}
              animate={{ opacity: 1, translateY: '0%' }}
              transition={{ duration: 0.3, type: 'spring' }}
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
