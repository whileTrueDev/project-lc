import create from 'zustand';

export interface GuideConditionStore {
  condition: boolean;
  setCondition(value: boolean): void;
  completeStep(): void;
}

export const guideConditionStore = create<GuideConditionStore>((set) => ({
  condition: false,
  setCondition: (value: boolean) => {
    set(() => ({
      condition: value,
    }));
  },
  completeStep: () => {
    set(() => ({
      condition: true,
    }));
  },
}));
