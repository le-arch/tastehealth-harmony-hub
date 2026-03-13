import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

// Animation variants
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground overflow-hidden backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-background to-muted/50 text-foreground border-primary/20 shadow-lg hover:shadow-xl hover:shadow-primary/10",
        destructive: "bg-gradient-to-br from-destructive/10 to-destructive/5 text-destructive border-destructive/30 shadow-lg hover:shadow-xl hover:shadow-destructive/20 [&>svg]:text-destructive",
        success: "bg-gradient-to-br from-green-500/10 to-green-500/5 text-green-700 dark:text-green-400 border-green-500/30 shadow-lg hover:shadow-xl hover:shadow-green-500/20",
        warning: "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 shadow-lg hover:shadow-xl hover:shadow-yellow-500/20",
        info: "bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/30 shadow-lg hover:shadow-xl hover:shadow-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Animation variants for entrance
const alertAnimationVariants = {
  initial: { 
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      mass: 1,
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

// Shimmer effect animation
const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Pulse animation for icons
const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, dismissible, onDismiss, icon, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          ref={ref}
          role="alert"
          variants={alertAnimationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover="hover"
          className={cn(
            alertVariants({ variant }),
            "relative group",
            className
          )}
          {...props}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />

          {/* Decorative corner accents */}
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-br-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          />

          {/* Content wrapper */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Icon with pulse animation */}
            {icon && (
              <motion.div
                className="absolute left-4 top-4"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
              >
                {icon}
              </motion.div>
            )}

            {/* Children */}
            <div className={cn(icon && "pl-7")}>
              {children}
            </div>

            {/* Dismiss button */}
            {dismissible && (
              <motion.button
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => {
                  setIsVisible(false);
                  onDismiss?.();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </motion.div>

          {/* Border glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-transparent"
            whileHover={{
              borderColor: variant === 'destructive' 
                ? 'rgba(239, 68, 68, 0.3)' 
                : variant === 'success'
                ? 'rgba(34, 197, 94, 0.3)'
                : variant === 'warning'
                ? 'rgba(234, 179, 8, 0.3)'
                : variant === 'info'
                ? 'rgba(59, 130, 246, 0.3)'
                : 'rgba(147, 51, 234, 0.3)',
              boxShadow: `0 0 20px ${
                variant === 'destructive' 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : variant === 'success'
                  ? 'rgba(34, 197, 94, 0.2)'
                  : variant === 'warning'
                  ? 'rgba(234, 179, 8, 0.2)'
                  : variant === 'info'
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(147, 51, 234, 0.2)'
              }`,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </AnimatePresence>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <motion.h5
    ref={ref}
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className={cn(
      "mb-1 font-semibold leading-none tracking-tight text-base",
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text",
      className
    )}
    {...props}
  >
    {children}
  </motion.h5>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className={cn(
      "text-sm [&_p]:leading-relaxed text-muted-foreground/90",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
))
AlertDescription.displayName = "AlertDescription"

// Example usage component with different variants
const AlertDemo = () => {
  return (
    <div className="space-y-4">
      <Alert variant="default" icon={<span>✨</span>}>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with beautiful animations.
        </AlertDescription>
      </Alert>

      <Alert variant="success" icon={<span>✅</span>} dismissible>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning" icon={<span>⚠️</span>}>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please check your input before continuing.
        </AlertDescription>
      </Alert>

      <Alert variant="info" icon={<span>ℹ️</span>}>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          New features are available. Click to learn more.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive" icon={<span>❌</span>}>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription, AlertDemo }