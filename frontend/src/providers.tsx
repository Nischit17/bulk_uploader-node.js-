"use client";

import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/sonner";

/**
 * Global providers wrapper component
 *
 * Wraps the application with all necessary providers:
 * - Redux Provider for state management
 * - Toaster for notifications
 *
 * @param {PropsWithChildren} props - The component props
 * @returns {JSX.Element} The providers wrapper component
 */
export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
