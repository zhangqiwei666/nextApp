"use client"; // 告诉 Next.js 这是一个客户端组件。因为使用了 React Context 和 useRef 等 Hooks，必须声明这是 Client Component（否则在服务端会报错）。

import { createStore, useStore } from 'zustand';
// 引入 zustand 核心。
// createStore 用于创建一个原生的状态仓库实例（Vanilla Store）。
// useStore 用于把那个原生实例和 React 的生命周期绑定起来。

import { createContext, useContext, useRef, ReactNode } from 'react';
// 引入 React 自带的一些 Hooks。

// ================ 1. 定义类型 ================

// 定义 Store 里存了哪些数据和方法。
export interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

// ================ 2. 状态工厂函数 ================

// 这是“生产” Store 的工厂。每次调用它，就会产生一个【全新、独立】的仓库！
// 它接收一个 initCount 作为初始值，默认是 0。
export const createCounterStore = (initCount: number = 0) => {
  return createStore<CounterStore>((set) => ({
    count: initCount,
    // 增加：获取上一次的状态 (state)，将 count 属性加1
    increment: () => set((state) => ({ count: state.count + 1 })),
    // 减少：将 count 属性减1
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }));
};

// 提取工厂函数返回值的结构（也就是 Zustand 仓库对象的标准类型，里面包括 getState, setState 等底层方法）。
// 这就是非常实用的 ReturnType 魔法，让 TypeScript 自动推导类型。
export type CounterStoreApi = ReturnType<typeof createCounterStore>;

// ================ 3. React 上下文（Context） ================

// 创建一个 React Context，用于在组件树中“往下传递”上面的那一套 Zustand 仓库。
// 一开始里面没有任何东西，所以默认值是 undefined。
export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

// 定义待会儿外部给它传惨的接口，children 必传（表示要包裹哪些组件），initialCount 可选。
export interface CounterStoreProviderProps {
  children: ReactNode;
  initialCount?: number;
}

// ================ 4. 供应商（Provider）组件 ================

// 这是在 layout 里面包裹一切的保护层。
export const CounterStoreProvider = ({ children, initialCount = 0 }: CounterStoreProviderProps) => {
  
  // 重点来了！用 useRef 存着刚才创建的实例。
  // 为什么要用 useRef 而不直接 let store = ...？
  // 因为每次 React 重新渲染（比如其他状态变化时），组件会重新执行。如果不存到 ref 里，就又会丢掉数据造一个新的空仓库了。
  const storeRef = useRef<CounterStoreApi>(null);
  
  // 组件第一次挂载的时候，ref 里面还没东西。于是我们立刻调用工厂帮它造一个，存进去。
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initialCount);
  }
  
  // 把藏在 ref 里面宝贵的仓库实例，作为大礼包 (value) 下发给所有被包在它内部的 children (我们的整个应用页面)。
  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

// ================ 5. 专属获取器（自定义 Hook）================

// 这是给你的页面调用的最后一步：比如 const count = useCounterStore((s) => s.count);
export function useCounterStore<T>(selector: (store: CounterStore) => T): T {
  // 1. 去向上通报：帮我找找上面最近的 Context 里面装的仓库实例拿下来。
  const storeContext = useContext(CounterStoreContext);
  
  // 2. 如果没找到（说明你在外部没有用 Provider 包裹应用），立刻抛出拦截报错，以防后面产生幽灵 Bug。
  if (!storeContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }
  
  // 3. 把拿下的仓库实例 (storeContext) 和你想要的字段 (selector) 交给 zustand 的核心引擎 useStore 解算。
  // useStore 帮你在状态变化的时候触发你的组件精准重新渲染！
  return useStore(storeContext, selector);
}
