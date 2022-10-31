import create from 'zustand';

export interface SettlementHistoryStore {
  selectedRound: string;
  handleRoundSelect: (r: SettlementHistoryStore['selectedRound']) => void;
  resetRoundSelect: () => void;
}

/** 정산내역 회차 상태 관리 */
export const settlementHistoryStore = create<SettlementHistoryStore>((set, get) => ({
  selectedRound: '',
  handleRoundSelect: (round) => set(() => ({ selectedRound: round })),
  resetRoundSelect: () => set({ selectedRound: '' }),
}));
