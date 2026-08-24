import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileState = {
  name: string;
  role: string;

  setName: (name: string) => void;
  setRole: (role: string) => void;

  resetProfile: () => void;
};

const initialState = {
  name: "Alem",
  role: "Founder",
};

export const useProfileStore =
  create<ProfileState>()(
    persist(
      (set) => ({
        ...initialState,

        setName: (name) => {
          set({
            name,
          });
        },

        setRole: (role) => {
          set({
            role,
          });
        },

        resetProfile: () => {
          set(initialState);
        },
      }),
      {
        name: "osus-profile-storage",
      },
    ),
  );