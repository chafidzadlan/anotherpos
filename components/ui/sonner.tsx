"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px] md:max-w-[450px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border backdrop-blur-md p-4 pr-6 shadow-lg transition-all duration-300 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full hover:shadow-xl",
  {
    variants: {
      variant: {
        default: "border-slate-200/60 bg-white/90 text-slate-800",
        success: "border-emerald-200/60 bg-emerald-50/90 text-emerald-800",
        error: "border-red-200/60 bg-red-50/90 text-red-800",
        warning: "border-amber-200/60 bg-amber-50/90 text-amber-800",
        info: "border-blue-200/60 bg-blue-50/90 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const toastIconVariants = cva(
  "flex-shrink-0 w-5 h-5 mt-0.5",
  {
    variants: {
      variant: {
        default: "text-slate-500",
        success: "text-emerald-600",
        error: "text-red-600",
        warning: "text-amber-600",
        info: "text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      showIcon?: boolean;
    }
>(({ className, variant, showIcon = true, children, ...props }, ref) => {
  const getIcon = () => {
    if (!showIcon) return null;

    switch (variant) {
      case "success":
        return <CheckCircle className={cn(toastIconVariants({ variant }))} />;
      case "error":
        return <XCircle className={cn(toastIconVariants({ variant }))} />;
      case "warning":
        return <AlertCircle className={cn(toastIconVariants({ variant }))} />;
      case "info":
        return <Info className={cn(toastIconVariants({ variant }))} />;
      default:
        return <Info className={cn(toastIconVariants({ variant }))} />;
    }
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {getIcon()}
      <div className="flex-1 space-y-1">
        {children}
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-slate-100/80 hover:text-slate-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Enhanced toast trigger function for easy usage
export const toast = {
  success: (title: string, description?: string) => {
    // This would integrate with your toast system
    console.log('Success toast:', { title, description });
  },
  error: (title: string, description?: string) => {
    console.log('Error toast:', { title, description });
  },
  warning: (title: string, description?: string) => {
    console.log('Warning toast:', { title, description });
  },
  info: (title: string, description?: string) => {
    console.log('Info toast:', { title, description });
  },
  default: (title: string, description?: string) => {
    console.log('Default toast:', { title, description });
  },
};

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};