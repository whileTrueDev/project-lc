import create from 'zustand';

export interface CarouselVideoStore {
  isPlaying: boolean;
  isFirstRender: boolean;
  setIsPlaying(state: boolean): void;
}

export const carouselVideoStore = create<CarouselVideoStore>((set) => ({
  isPlaying: false,
  isFirstRender: true,
  setIsPlaying: (state: boolean) => {
    set({ isPlaying: state, isFirstRender: false });
  },
}));
