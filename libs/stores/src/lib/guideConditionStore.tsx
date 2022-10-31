import create from 'zustand';

export interface GuideConditionStore {
  condition: boolean;
  setCondition(value: boolean): void;
  completeStep(): void;
}

/** 시작가이드 단계별 상태 관리 */
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
