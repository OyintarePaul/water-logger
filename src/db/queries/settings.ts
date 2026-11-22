import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../client";
import { DEFAULT_SETTINGS } from "../constants";
import { settings } from "../schema";

export type Settings = typeof settings.$inferSelect;

const SETTINGS_ROW_ID = 1;

// Creates the single settings row if it doesn't exist yet
export function ensureSettings() {
	db.insert(settings)
		.values({ id: SETTINGS_ROW_ID, ...DEFAULT_SETTINGS })
		.onConflictDoNothing()
		.run();
}

export function updateSettings(patch: Partial<Omit<Settings, "id">>) {
	db.update(settings).set(patch).where(eq(settings.id, SETTINGS_ROW_ID)).run();
}

export function completeOnboarding() {
	updateSettings({ onboardingCompleted: true });
}

export function useSettings(): Settings {
	const { data } = useLiveQuery(
		db.select().from(settings).where(eq(settings.id, SETTINGS_ROW_ID)),
	);
	return data[0] ?? { id: SETTINGS_ROW_ID, ...DEFAULT_SETTINGS };
}

export function resetOnboarding() {
    updateSettings({ onboardingCompleted: false });
}
