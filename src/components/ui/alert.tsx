import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground overflow-hidden backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-background to-muted/50 text-foreground border-primary/20 shadow-lg",
        destructive: "bg-gradient-to-br from-destructive/10 to-destructive/5 text-destructive border-destructive/30 shadow-lg [&>svg]:text-destructive",
        success: "bg-gradient-to-br from-green-500/10 to-green-500/5 text-green-700 dark:text-green-400 border-green-500/30 shadow-lg",
        warning: "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 shadow-lg",
        info: "bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/30 shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-base", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed text-muted-foreground/90", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
