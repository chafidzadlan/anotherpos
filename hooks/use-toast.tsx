"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose
} from '@/components/ui/sonner';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
    default: (title: string, description?: string, duration?: number) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function POSToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toastActions = {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'success', duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'error', duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'warning', duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'info', duration }),
    default: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'default', duration }),
  };

  return (
    <ToastContext.Provider value={{ toast: toastActions, dismiss }}>
      <RadixToastProvider>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            duration={toast.duration || 5000}
            onOpenChange={(open) => {
              if (!open) dismiss(toast.id);
            }}
          >
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

// Export convenience hook for easy usage
export { useToast as usePOSToast };