import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "expo-sqlite/kv-store";

interface Settings {
	dailyGoal: number;
	reminderEnabled: boolean;
	reminderId: string | null;
}

interface SettingsState extends Settings {
	updateSettings: (patch: Partial<Settings>) => void;
}

const defaults: Settings = {
	dailyGoal: 10,
	reminderEnabled: false,
	reminderId: null,
};

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			...defaults,
			updateSettings: (patch) => set(patch),
		}),
		{
			name: "app-settings",
			storage: createJSONStorage(() => Storage),
			partialize: (state): Settings => ({
				dailyGoal: state.dailyGoal,
				reminderEnabled: state.reminderEnabled,
				reminderId: state.reminderId,
			}),
			version: 1,
		},
	),
);
