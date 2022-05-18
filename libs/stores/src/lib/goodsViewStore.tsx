import { GoodsByIdRes, GoodsRelatedBroadcaster } from '@project-lc/shared-types';
import create from 'zustand';

type SelectedOpt = GoodsByIdRes['options'][number] & { quantity: number };
type SelectedBc = GoodsRelatedBroadcaster;
interface GoodsViewStore {
  selectedNavIdx: number;
  handleSelectNav: (num: number) => void;
  // 선택된 옵션 목록
  selectedOpts: Array<SelectedOpt>;
  handleSelectOpt: (opt: SelectedOpt, onFail?: () => void) => void;
  handleRemoveOpt: (targetOptId: number) => void;
  handleIncreaseOptQuantity: (targetOptId: number) => void;
  handleDecreaseOptQuantity: (targetOptId: number) => void;
  // 선택된 방송인
  selectedBc: SelectedBc | null;
  handleSelectBc: (v: SelectedBc | null) => void;
  supportMessage: string;
  onSupMsgChange: (msg: string) => void;
}
export const useGoodsViewStore = create<GoodsViewStore>((set, get) => ({
  selectedNavIdx: 0,
  handleSelectNav: (num: number) => {
    set({ selectedNavIdx: num });
  },
  // ******************************
  // 선택한 상품 옵션
  selectedOpts: [],
  handleSelectOpt: (opt: SelectedOpt, onFail?: () => void) => {
    const { selectedOpts } = get();
    if (selectedOpts.findIndex((x) => x.id === opt.id) > -1) {
      if (onFail) onFail();
    } else {
      set({ selectedOpts: selectedOpts.concat(opt) });
    }
  },
  handleRemoveOpt: (targetOptId: number) => {
    const { selectedOpts } = get();
    set({ selectedOpts: selectedOpts.filter((o) => o.id !== targetOptId) });
  },
  handleIncreaseOptQuantity: (targetOptId: number) => {
    const { selectedOpts } = get();
    const targetIdx = selectedOpts.findIndex((o) => o.id === targetOptId);
    if (targetIdx > -1) {
      const target = selectedOpts[targetIdx];
      const increased = target.quantity ? target.quantity + 1 : 1;
      const opt = { ...target, quantity: increased };
      const selected = [...selectedOpts];
      selected[targetIdx] = opt;
      set({ selectedOpts: selected });
    }
  },
  handleDecreaseOptQuantity: (targetOptId: number) => {
    const { selectedOpts } = get();
    const targetIdx = selectedOpts.findIndex((o) => o.id === targetOptId);
    if (targetIdx > -1) {
      const target = selectedOpts[targetIdx];
      if (target.quantity === 1) return;
      const decreased = target.quantity ? target.quantity - 1 : 1;
      const opt = { ...target, quantity: decreased };
      const selected = [...selectedOpts];
      selected[targetIdx] = opt;
      set({ selectedOpts: selected });
    }
  },
  // ******************************
  // 선택한 후원 방송인
  selectedBc: null,
  handleSelectBc: (v: SelectedBc | null) => {
    set({ selectedBc: v });
  },
  supportMessage: '',
  onSupMsgChange: (msg: string) => {
    if (msg.length > 30) return;
    set({ supportMessage: msg });
  },
}));
