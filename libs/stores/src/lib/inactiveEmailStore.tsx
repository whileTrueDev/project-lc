import create from 'zustand';

export interface InactiveEmail {
  email: string;
  setToActivateEmail(value: string): void;
}

export const inactiveEmailStore = create<InactiveEmail>((set, get) => ({
  email: '',
  setToActivateEmail: (value: string) => {
    set(() => ({
      email: value,
    }));
  },
}));
