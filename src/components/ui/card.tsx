import * as React from "react"
import { motion, MotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

// Animation variants
const cardVariants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

// Rainbow border effect (without actual border)
const rainbowEffect = {
  initial: { 
    boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)"
  },
  hover: {
    boxShadow: [
      "0 0 20px 2px rgba(255, 99, 132, 0.3)",
      "0 0 20px 2px rgba(54, 162, 235, 0.3)",
      "0 0 20px 2px rgba(255, 206, 86, 0.3)",
      "0 0 20px 2px rgba(75, 192, 192, 0.3)",
      "0 0 20px 2px rgba(153, 102, 255, 0.3)",
      "0 0 20px 2px rgba(255, 159, 64, 0.3)",
      "0 0 20px 2px rgba(255, 99, 132, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Glowing orb effect
const glowingOrb = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  hover: {
    opacity: [0, 0.5, 0],
    scale: [0.8, 1.5, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  withGlow?: boolean;
  withRainbow?: boolean;
  withPulse?: boolean;
  interactive?: boolean;
  delay?: number;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    animated = true, 
    withGlow = true,
    withRainbow = false,
    withPulse = false,
    interactive = true,
    delay = 0,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const getAnimationVariants = () => {
      const variants: any = {
        ...cardVariants,
      };
      
      if (withRainbow) {
        variants.hover = {
          ...variants.hover,
          ...rainbowEffect.hover,
        };
      }
      
      return variants;
    };

    const baseClasses = cn(
      "w-full rounded-xl",
      "text-card-foreground",
      "backdrop-blur-sm transition-all duration-300",
      "relative overflow-hidden",
      "border-0", // No border
      // Base background colors with proper dark mode support
      "bg-gradient-to-br from-white to-gray-50",
      "dark:from-slate-800 dark:to-slate-900",
      // Hover effects using Tailwind classes
      withGlow && "hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/30",
      withPulse && "animate-pulse-slow",
      className
    );

    if (!animated) {
      return (
        <div
          ref={ref}
          className={baseClasses}
          {...props}
        >
          {/* Static decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">{children}</div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          interactive && "cursor-pointer group"
        )}
        variants={getAnimationVariants()}
        initial="initial"
        animate="animate"
        whileHover={interactive ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        custom={delay}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        {...props}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
          animate={{
            opacity: isHovered ? 0.2 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Decorative gradient orbs - with dark mode support */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl dark:from-primary/30 dark:via-primary/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-destructive/20 via-destructive/10 to-transparent rounded-full blur-3xl dark:from-destructive/30 dark:via-destructive/20"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Glowing orb effect on hover */}
        {withRainbow && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            variants={glowingOrb}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-2xl dark:from-primary/40 dark:via-secondary/40 dark:to-accent/40" />
          </motion.div>
        )}

        {/* Shimmer effect on hover */}
        {interactive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}

        {/* Color wave effect */}
        {withPulse && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Corner accent - with dark mode support */}
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-transparent rounded-br-2xl dark:from-primary/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, ease: "easeInOut" }}
        />

        {/* Bottom corner accent - with dark mode support */}
        <motion.div
          className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-2xl dark:from-primary/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, ease: "easeInOut" }}
        />
      </motion.div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean; delay?: number }
>(({ className, animated = true, delay = 0.1, children, ...props }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-4 sm:p-5", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { animated?: boolean; delay?: number }
>(({ className, animated = true, delay = 0.15, children, ...props }, ref) => {
  const Component = animated ? motion.h3 : 'h3';
  const animationProps = animated ? {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "text-lg sm:text-xl font-semibold leading-none tracking-tight",
        "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { animated?: boolean; delay?: number }
>(({ className, animated = true, delay = 0.2, children, ...props }, ref) => {
  const Component = animated ? motion.p : 'p';
  const animationProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn("text-sm text-muted-foreground/90 leading-relaxed", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean; delay?: number }
>(({ className, animated = true, delay = 0.25, children, ...props }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn("p-4 sm:p-5 pt-0", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean; delay?: number }
>(({ className, animated = true, delay = 0.3, children, ...props }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn("flex flex-col sm:flex-row items-center justify-end gap-2 p-4 sm:p-5 pt-0", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
CardFooter.displayName = "CardFooter"

// Card grid container with animations
const CardGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }
>(({ className, animated = true, children, ...props }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
CardGrid.displayName = "CardGrid"

// Horizontal scrolling cards container with snap
const ScrollableCardContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }
>(({ className, animated = true, children, ...props }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "card-scroll-container",
        "overflow-x-auto overflow-y-hidden",
        "scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent",
        "hover:scrollbar-thumb-primary/30",
        "pb-2",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
ScrollableCardContainer.displayName = "ScrollableCardContainer"

// Content container for scrollable cards
const ScrollableCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }
>(({ className, animated = true, children, ...props }, ref) => {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.05, ease: "easeInOut" }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "card-scroll-content",
        "flex gap-3 sm:gap-4",
        className
      )}
      {...animationProps}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 }
          }}
          transition={{ delay: index * 0.05, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          {child}
        </motion.div>
      ))}
    </Component>
  )
})
ScrollableCardContent.displayName = "ScrollableCardContent"

// Add this to your global CSS file for the pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.95;
    }
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
document.head.appendChild(style);

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardGrid,
  ScrollableCardContainer,
  ScrollableCardContent
}