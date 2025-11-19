"use client";

import { SessionProvider } from "next-auth/react";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>
        {children}
        <Toaster />
      </AppProvider>
    </SessionProvider>
  );
}
