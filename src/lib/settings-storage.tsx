import Storage from 'expo-sqlite/kv-store';

const SETTINGS_KEY = 'settings';

export type Settings = {
  dailyGoal: number;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
};

export const DEFAULTS: Settings = {
  dailyGoal: 8,
  reminderEnabled: false,
  reminderHour: 9,
  reminderMinute: 0,
};

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await Storage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) } as Settings;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await Storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}