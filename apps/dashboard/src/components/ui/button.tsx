import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary-bg)] text-[var(--primary-text)] hover:bg-[var(--primary-hover)]",
        destructive:
          "bg-[var(--accent-red-bg)] text-[var(--accent-red-text)] hover:bg-[#FDEBEC]/80",
        outline:
          "border border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] hover:border-[var(--text-tertiary)]",
        secondary:
          "bg-[var(--canvas-warm)] text-[var(--text-primary)] hover:bg-[var(--border)]",
        ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--canvas-warm)]",
        link: "text-[var(--text-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-md",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
