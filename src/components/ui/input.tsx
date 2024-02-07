import * as React from "react"
import { Icon } from '@iconify/react'

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: string
  }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className={cn(
        "flex h-10 items-center rounded-lg border border-border bg-background/40 backdrop-blur-lg transition-colors focus-within:!bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900"
        , className)}>
        {
          icon ? (
            <div className="flex min-w-10 justify-center">
              <Icon icon={icon} className='text-lg' />
            </div>
          ) : null
        }
        <input 
          type={type}
          className={cn(
            "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 h-full grow cursor-pointer border-transparent bg-transparent outline-none focus:cursor-text",
            {
              'pl-3': !icon
            }
          )}
          ref={ref}
          spellCheck={false}
          {...props}
        />
      </div>
    )
  })

Input.displayName = "Input"

export { Input }
