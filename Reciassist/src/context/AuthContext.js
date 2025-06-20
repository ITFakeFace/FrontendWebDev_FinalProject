import { create } from "zustand";
import * as AuthService from "../services/authService";

export const useUserStore = create((set) => ({
  user: AuthService.getCurrentUser(),

  login: (credentials) => {
    const user = AuthService.loginUser(credentials);
    set({ user });
    return user;
  },

  register: (info) => {
    const user = AuthService.registerUser(info);
    set({ user });
    return user;
  },

  logout: () => {
    AuthService.logoutUser();
    set({ user: null });
  },

  bootstrap: () => {
    AuthService.bootstrap();
    const user = AuthService.getCurrentUser();
    if (user) set({ user });
  }
}));
