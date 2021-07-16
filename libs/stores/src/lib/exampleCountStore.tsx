import create from 'zustand';

interface ExampleCountStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useExampleCountStore = create<ExampleCountStore>(set => ({
  count: 0,
  increment: () => set(prev => ({ ...prev, count: prev.count + 1 })),
  decrement: () => set(prev => ({ ...prev, count: prev.count - 1 })),
}));
