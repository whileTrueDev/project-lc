import create from 'zustand';
import { getProfile } from '@project-lc/hooks';
import { UserProfileRes } from '@project-lc/shared-types';

type LoginUser = UserProfileRes;

export interface AuthStoreState {
  isLoggedIn: boolean;
  isLoggedOut: boolean;
  loginUser: LoginUser | null;
  loginLoading: boolean;
  loginError: any;
  getUserProfile: () => void;
  logout: () => void;
  logoutLoading: boolean;
  logoutError: any;
  setUser: (user: LoginUser) => void;
}

const defaultState = {
  isLoggedIn: false,
  isLoggedOut: true,
  loginUser: null,
  loginLoading: false,
  loginError: null,
  logoutLoading: false,
  logoutError: null,
};

export const authStore = create<AuthStoreState>((set, get) => ({
  ...defaultState,
  setUser: (user: LoginUser) => {
    set((state) => ({ ...state, loginUser: user }));
  },
  getUserProfile: async () => {
    try {
      set((state) => ({ ...state, loginLoading: true, loginError: null }));
      const res = await getProfile();
      set((state) => ({
        ...state,
        loginUser: res,
        isLoggedIn: true,
        isLoggedOut: false,
      }));
      set((state) => ({ ...state, loginLoading: false }));
    } catch (error) {
      set((state) => ({ ...state, loginError: error, loginLoading: false }));
    }
  },
  logout: async () => {
    set((state) => ({ ...state, logoutLoading: true }));
    try {
      // const data = await axios.post('/auth/logout');
      set((state) => ({
        ...state,
        loginUser: null,
        isLoggedIn: false,
        isLoggedOut: true,
      }));
    } catch (error) {
      set((state) => ({ ...state, logoutError: error }));
    } finally {
      set((state) => ({ ...state, logoutLoading: false }));
    }
  },
}));
