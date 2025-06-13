import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null, // user mặc định là null
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));