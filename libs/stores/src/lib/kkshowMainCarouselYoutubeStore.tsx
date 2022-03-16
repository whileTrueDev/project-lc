import create from 'zustand';

export interface CarouselYoutubeStore {
  isPlaying: boolean;
  isFirstRender: boolean;
  setIsPlaying(state: boolean): void;
}

export const carouselYoutubeStore = create<CarouselYoutubeStore>((set) => ({
  isPlaying: false,
  isFirstRender: true,
  setIsPlaying: (state: boolean) => {
    set({ isPlaying: state, isFirstRender: false });
  },
}));
