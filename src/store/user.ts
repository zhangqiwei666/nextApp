import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface INFO {
   username: string,
   email: string 
}

export interface UserStore {
    info: INFO;
    setInfo: (newInfo: Partial<INFO>) => void;
}

export const userInfoStore = create<UserStore>()(
  persist(
    (set) => ({
        info: {
            username: '',
            email: ''
        },
        setInfo: (newInfo) => set((state) => ({ info: { ...state.info, ...newInfo } }))
    }),
    {
      name: 'user-storage',
    }
  )
);