// src/store/counterStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useCounterStore = create(devtools((set) => ({
  count: 0,
  increment: () => set((state: { count: number }) => ({ count: state.count + 1 })),
  decrement: () => set((state: { count: number }) => ({ count: state.count - 1 })),
})))

export default useCounterStore