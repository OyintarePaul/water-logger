import Storage from "expo-sqlite/kv-store";
import { formatDateKey, getLast7DayKeys } from "@/lib/dates";

export const STORAGE_KEY = "water-log";

type WaterLog = Record<string, number>;

export type HistoryEntry = { dateKey: string; count: number };

export async function readLog(): Promise<WaterLog> {
	try {
		const raw = await Storage.getItem(STORAGE_KEY);
		if (!raw) return {};
		return JSON.parse(raw) as WaterLog;
	} catch {
		return {};
	}
}

async function writeLog(log: WaterLog): Promise<void> {
	await Storage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export async function getCount(dateKey: string): Promise<number> {
	const log = await readLog();
	return log[dateKey] ?? 0;
}

export async function addGlass(dateKey: string): Promise<number> {
	const log = await readLog();
	const next = (log[dateKey] ?? 0) + 1;
	log[dateKey] = next;
	await writeLog(log);
	return next;
}

export async function undoGlass(dateKey: string): Promise<number> {
	const log = await readLog();
	const current = log[dateKey] ?? 0;
	if (current === 0) return 0;
	const next = current - 1;
	log[dateKey] = next;
	await writeLog(log);
	return next;
}

// Consecutive days meeting the goal, ending today (or yesterday, if today isn't done yet)
export async function getStreak(goal: number): Promise<number> {
	const log = await readLog();
	const cursor = new Date();

	// Today hasn't met the goal yet: start counting from yesterday instead
	if ((log[formatDateKey(cursor)] ?? 0) < goal) {
		cursor.setDate(cursor.getDate() - 1);
	}

	let streak = 0;
	while (streak < 365 && (log[formatDateKey(cursor)] ?? 0) >= goal) {
		streak++;
		cursor.setDate(cursor.getDate() - 1);
	}

	return streak;
}

// Every logged day, newest first
export async function getAllEntries(): Promise<HistoryEntry[]> {
	const log = await readLog();
	return Object.entries(log)
		.map(([dateKey, count]) => ({ dateKey, count }))
		.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export async function seedDb() {
	const keys = getLast7DayKeys();
	const log = {} as WaterLog;
	for (const key of keys) {
		log[key] = Math.floor(Math.random() * 20 + 1);
	}
	writeLog(log);
}
