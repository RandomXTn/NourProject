"use client";

import { useState, useEffect, useCallback } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

let toastIdCounter = 0;

const listeners: Array<(toasts: ToastData[]) => void> = [];
let memoryToasts: ToastData[] = [];

function notify(newToasts: ToastData[]) {
  memoryToasts = newToasts;
  listeners.forEach((l) => l(memoryToasts));
}

export function toast({
  title,
  description,
  variant = "default",
  duration = 4000,
  action,
}: Omit<ToastData, "id">) {
  const id = String(++toastIdCounter);
  const newToast: ToastData = {
    id,
    title,
    description,
    variant,
    duration,
    action,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss(id);
    },
  };
  notify([...memoryToasts, newToast]);

  setTimeout(() => dismiss(id), duration);

  return { id, dismiss: () => dismiss(id) };
}

function dismiss(id: string) {
  notify(memoryToasts.filter((t) => t.id !== id));
}

export function useToast() {
  const [state, setState] = useState<ToastData[]>(memoryToasts);

  const subscribe = useCallback((listener: (t: ToastData[]) => void) => {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  useEffect(() => subscribe(setState), [subscribe]);

  return { toasts: state, toast, dismiss };
}
