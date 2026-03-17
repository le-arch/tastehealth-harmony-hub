import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { motion, AnimatePresence, type MotionProps } from "framer-motion"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

// Animation variants
const formItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  focus: {
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

const labelVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  focus: {
    color: "rgb(var(--primary-rgb))",
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

const messageVariants = {
  initial: { opacity: 0, height: 0, y: -10 },
  animate: { 
    opacity: 1, 
    height: "auto", 
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    y: -10,
    transition: {
      duration: 0.2
    }
  }
}

const errorVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400
    }
  },
  exit: { 
    scale: 0.9, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean; index?: number }
>(({ className, animated = true, index = 0, children, ...props }, ref) => {
  const id = React.useId()
  const [isFocused, setIsFocused] = React.useState(false)

  const baseClasses = cn(
    "space-y-2 relative",
    "rounded-lg p-3",
    "transition-all duration-300",
    isFocused && "bg-primary/5",
    className
  )

  if (!animated) {
    return (
      <FormItemContext.Provider value={{ id }}>
        <div 
          ref={ref} 
          className={baseClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
          <div className="relative z-10">{children}</div>
        </div>
      </FormItemContext.Provider>
    )
  }

  return (
    <FormItemContext.Provider value={{ id }}>
      <motion.div
        ref={ref}
        variants={formItemVariants}
        custom={index}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileFocus="focus"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={baseClasses}
        {...(props as any)}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-lg pointer-events-none"
          animate={{
            opacity: isFocused ? 0.2 : 0,
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Decorative corner accents */}
        <motion.div
          className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-primary/20 to-transparent rounded-br-2xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 + 0.1, duration: 0.4 }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-2xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 + 0.2, duration: 0.4 }}
        />

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Border glow on focus */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary/0 pointer-events-none"
          animate={{
            borderColor: isFocused ? "rgba(147, 51, 234, 0.3)" : "rgba(147, 51, 234, 0)",
            boxShadow: isFocused ? "0 0 20px rgba(147, 51, 234, 0.1)" : "0 0 0 rgba(147, 51, 234, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { animated?: boolean }
>(({ className, animated = true, children, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  const [isFocused, setIsFocused] = React.useState(false)

  const baseClasses = cn(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "transition-all duration-300",
    error ? "text-destructive" : "text-foreground",
    className
  )

  if (!animated) {
    return (
      <Label
        ref={ref}
        className={baseClasses}
        htmlFor={formItemId}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {children}
        {error && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </Label>
    )
  }

  return (
    <motion.div
      variants={labelVariants}
      initial="initial"
      animate={isFocused ? "focus" : "animate"}
      whileHover={{ x: 2 }}
      className="inline-block"
    >
      <Label
        ref={ref}
        className={baseClasses}
        htmlFor={formItemId}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        <motion.span
          animate={error ? {
            scale: [1, 1.05, 1],
            transition: { duration: 0.3 }
          } : {}}
        >
          {children}
        </motion.span>
        {error && (
          <motion.span
            className="ml-1 text-destructive inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            *
          </motion.span>
        )}
      </Label>
    </motion.div>
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & { animated?: boolean }
>(({ children, animated = true, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const [isFocused, setIsFocused] = React.useState(false)

  const child = React.Children.only(children) as React.ReactElement
  const enhancedChild = React.cloneElement(child, {
    onFocus: (e: React.FocusEvent) => {
      setIsFocused(true)
      child.props.onFocus?.(e)
    },
    onBlur: (e: React.FocusEvent) => {
      setIsFocused(false)
      child.props.onBlur?.(e)
    },
    className: cn(
      child.props.className,
      "transition-all duration-300",
      animated && "focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/20",
      error && "border-destructive focus:border-destructive focus:ring-destructive"
    )
  })

  if (!animated) {
    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      >
        {enhancedChild}
      </Slot>
    )
  }

  return (
    <motion.div
      animate={{
        scale: isFocused ? 1.02 : 1,
        transition: { duration: 0.2 }
      }}
    >
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      >
        {enhancedChild}
      </Slot>
    </motion.div>
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { animated?: boolean }
>(({ className, animated = true, children, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  const baseClasses = cn(
    "text-sm text-muted-foreground/80 leading-relaxed",
    className
  )

  if (!animated) {
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={baseClasses}
        {...props}
      >
        {children}
      </p>
    )
  }

  return (
    <motion.p
      ref={ref}
      id={formDescriptionId}
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={baseClasses}
      {...(props as any)}
    >
      {children}
    </motion.p>
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { animated?: boolean }
>(({ className, children, animated = true, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  const baseClasses = cn(
    "text-sm font-medium text-destructive flex items-center gap-1",
    className
  )

  if (!animated) {
    return (
      <p
        ref={ref}
        id={formMessageId}
        className={baseClasses}
        {...props}
      >
        {body}
      </p>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.p
        ref={ref}
        id={formMessageId}
        variants={errorVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={baseClasses}
        {...(props as any)}
      >
        <motion.span
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.5,
            delay: 0.2
          }}
        >
          ⚠️
        </motion.span>
        {body}
      </motion.p>
    </AnimatePresence>
  )
})
FormMessage.displayName = "FormMessage"

// Form container with animation
const FormContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }
>(({ className, animated = true, children, ...props }, ref) => {
  const baseClasses = cn(
    "space-y-6 relative",
    "rounded-xl p-6",
    "bg-gradient-to-br from-background to-muted/30",
    "border border-primary/20 shadow-xl",
    "backdrop-blur-sm",
    className
  )

  if (!animated) {
    return (
      <div ref={ref} className={baseClasses} {...props}>
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-destructive/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300
      }}
      className={baseClasses}
      {...(props as any)}
    >
      {/* Animated decorative elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl pointer-events-none"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"
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
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-destructive/20 via-destructive/10 to-transparent rounded-full blur-3xl pointer-events-none"
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

      {/* Corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-transparent rounded-br-3xl pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-3xl pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
})
FormContainer.displayName = "FormContainer"

export {
  useFormField,
  Form,
  FormContainer,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}