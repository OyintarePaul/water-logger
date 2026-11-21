import { desc, eq, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../client";
import { waterEntries } from "../schema";

// Timestamps are stored in UTC, so compare the local calendar day inside SQLite
const isToday = sql`date(${waterEntries.loggedAt}, 'localtime') = date('now', 'localtime')`;

export function logWater({
	label,
	amountMl,
}: {
	label: string;
	amountMl: number;
}) {
	const result = db.insert(waterEntries).values({ label, amountMl }).run();
	return result.lastInsertRowId;
}

export function deleteEntry(id: number) {
	db.delete(waterEntries).where(eq(waterEntries.id, id)).run();
}

export function useTodayEntries() {
	const { data } = useLiveQuery(
		db
			.select()
			.from(waterEntries)
			.where(isToday)
			.orderBy(desc(waterEntries.id)),
	);
	return data;
}

export function useTodaySummary() {
	const entries = useTodayEntries() ?? [];
	const lastEntry = entries[0]; // entries are ordered newest first

	return {
		consumedMl: entries.reduce((sum, e) => sum + e.amountMl, 0),
		lastLabel: lastEntry?.label,
		lastTime: lastEntry ? formatTime(lastEntry.loggedAt) : undefined,
	};
}

export function clearAllEntries() {
	db.delete(waterEntries).run();
}

export function parseUtc(utcTimestamp: string) {
	return new Date(utcTimestamp.replace(" ", "T") + "Z");
}

export function formatTime(utcTimestamp: string) {
	return parseUtc(utcTimestamp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function useAllEntries() {
	const { data } = useLiveQuery(
		db.select().from(waterEntries).orderBy(desc(waterEntries.id)),
	);
	return data;
}
