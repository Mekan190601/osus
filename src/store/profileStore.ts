import { create } from "zustand";

type ProfileState = {
  name: string;
  role: string;

  setName: (name: string) => void;
  setRole: (role: string) => void;

  resetProfile: () => void;
};

const initialState = {
  name: "",
  role: "Şahsy profil",
};

export const useProfileStore =
  create<ProfileState>()((set) => ({
    ...initialState,

    setName: (name) => {
      set({
        name: name.trim(),
      });
    },

    setRole: (role) => {
      set({
        role: role.trim() || "Şahsy profil",
      });
    },

    resetProfile: () => {
      set({
        ...initialState,
      });
    },
  }));