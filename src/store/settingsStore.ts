import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"
import Storage from "expo-sqlite/kv-store";

interface Settings {
    dailyGoal: number
}

interface SettingsState extends Settings {
    updateSettings: (patch: Partial<Settings>) => void
}

const defaults: Settings = {
    dailyGoal: 10
}

export const useSettingsStore = create<SettingsState>()(persist(
    (set) => ({
        ...defaults,
        updateSettings: (patch) => set(patch),
    }),
    {
        name: "app-settings",
        storage: createJSONStorage(() => Storage),
        partialize: (state): Settings => ({ dailyGoal: state.dailyGoal }),
        version: 1
    }
))
