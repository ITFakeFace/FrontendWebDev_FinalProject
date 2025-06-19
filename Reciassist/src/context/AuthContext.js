import { create } from "zustand";

const checkLogged = () => {
  const session = localStorage.getItem('sessionUser');
  if (session) {
    const parsed = JSON.parse(session);
    // Kiểm tra thời gian hết hạn
    if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
      setUser(parsed.user);
      setLogged(true);
    } else {
      localStorage.removeItem('sessionUser');
      logout();
      setLogged(false);
    }
  }
};

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => {
    // Lưu vào localStorage với hạn 1 giờ
    const expiresAt = Date.now() + 60 * 60 * 1000;
    localStorage.setItem('token', JSON.stringify({ user, expiresAt }));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
}));
