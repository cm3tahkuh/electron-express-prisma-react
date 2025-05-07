import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface Role {
  roleName: string;
}

export interface User {
  id: number;
  login: string;
  role: Role;
}

interface UserStore {
  isAuth: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const setJWT = (token: string) => {
  localStorage.setItem("token", token);
};

export const getJWT = () => {
  return localStorage.getItem("token");
};

export const removeJWT = () => {
  localStorage.removeItem("token");
};

const useUserStore = create<UserStore>((set) => ({
  isAuth: false,
  user: null,
  token: null,
  login: (user, token) => {
    set({ isAuth: true, user, token });

    setJWT(token);
  },
  logout: () => {
    set({ isAuth: false, user: null, token: null });

    removeJWT();
  },
  checkAuth: async () => {
    const jwt = getJWT();
    if (jwt) {
      try {
        const decoded: { user: User } = jwtDecode(jwt);

        set({
          isAuth: true,
          token: jwt,
          user: decoded.user,
        });
      } catch (e) {
        console.error("Ошибка при декодировании JWT:", e);
        set({ isAuth: false, user: null, token: null });
        removeJWT();
      }
    } else {
      set({ isAuth: false, user: null, token: null });
    }
  },
}));

export default useUserStore;
