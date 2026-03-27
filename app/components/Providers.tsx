"use client";

// HeroUI v3 基于 React Aria Components，不需要全局 Provider
// 如果将来需要添加其他 Provider（如主题、国际化等），可以在这里添加

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
