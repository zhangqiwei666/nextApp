"use client";

import { ToastProvider } from "@heroui/react";
import { Suspense } from "react";
import { UserStoreProvider } from "@/store/user";
import { CounterStoreProvider } from "@/store/counterStore";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ToastProvider placement="top" />
      <UserStoreProvider>
        <CounterStoreProvider>
          {children}
        </CounterStoreProvider>
      </UserStoreProvider>
    </Suspense>
  );
}
