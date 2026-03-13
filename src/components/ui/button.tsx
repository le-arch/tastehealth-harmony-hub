import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// Simple animation variants
const buttonAnimations = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/20",
        destructive: "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/70 shadow-lg hover:shadow-xl hover:shadow-destructive/20",
        outline: "border-2 border-input bg-background/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-green-500/30",
        secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70 shadow-md hover:shadow-lg",
        ghost: "hover:bg-gradient-to-r hover:from-green-500/10 hover:to-green-600/10 hover:text-green-600 backdrop-blur-sm hover:shadow-inner",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl hover:shadow-green-500/30",
        info: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl hover:shadow-blue-500/30",
        premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-10 rounded-md px-3",
        lg: "h-14 rounded-md px-8 text-base",
        icon: "px-4 py-3 text-lg",
        xs: "h-8 rounded-md px-2 text-xs",
        xl: "h-16 rounded-lg px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    animated = true,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Simple version without complex animations
    if (!animated) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    // Animated version with simple hover/tap effects
    return (
      <motion.div
        style={{ display: "inline-block" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      </motion.div>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };