"use client";

import { ToastProvider } from "@heroui/react";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ToastProvider placement="top" />
      {children}
    </Suspense>
  );
}
