/**
 * Client-side Providers Wrapper
 * Wraps children with all necessary context providers
 */

'use client';

import { ToastProvider } from "@/contexts/ToastContext";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
