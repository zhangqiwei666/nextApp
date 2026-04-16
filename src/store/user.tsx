"use client";

import { createStore } from 'zustand';
import { useStore } from 'zustand';
import { createContext, useContext, useRef, ReactNode } from 'react';

export interface INFO {
   username?: string;
   email?: string;
   [key: string]: any;
}

export interface UserStore {
    info: INFO | null;
    setInfo: (newInfo: Partial<INFO>) => void;
}

export const createUserStore = (initState: INFO | null = null) => {
  return createStore<UserStore>((set) => ({
    info: initState,
    setInfo: (newInfo) => set((state) => ({ 
      info: state.info ? { ...state.info, ...newInfo } : (newInfo as INFO)
    }))
  }));
};

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface UserStoreProviderProps {
  children: ReactNode;
  initialState?: INFO | null;
}

export const UserStoreProvider = ({ children, initialState = null }: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createUserStore(initialState);
  }
  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export function useUserStore<T>(selector: (store: UserStore) => T): T {
  const storeContext = useContext(UserStoreContext);
  
  if (!storeContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }
  
  return useStore(storeContext, selector);
}