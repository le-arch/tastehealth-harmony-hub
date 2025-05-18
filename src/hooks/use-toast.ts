
import { toast as toastOriginal } from "sonner";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: ToastActionElement;
};

// Custom useToast hook that provides a toast function with the needed interface
const useToast = () => {
  const toast = ({
    title,
    description,
    variant,
    duration,
    action,
    ...props
  }: ToastOptions) => {
    toastOriginal(title, {
      description,
      action,
      duration,
      className: variant === "destructive" ? "destructive" : undefined,
      ...props,
    });
  };

  return {
    toast,
    // Required to maintain compatibility with the existing toast component
    toasts: [] as any[],
    dismiss: toastOriginal.dismiss,
    remove: toastOriginal.dismiss,
  };
};

// For direct use without the hook
const toast = ({
  title,
  description,
  variant,
  duration,
  action,
  ...props
}: ToastOptions) => {
  toastOriginal(title, {
    description,
    action,
    duration,
    className: variant === "destructive" ? "destructive" : undefined,
    ...props,
  });
};

export { useToast, toast };
