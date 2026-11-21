import { useMemo } from "react";
import { DAILY_GOAL_ML } from "../constants";
import type { waterEntries } from "../schema";
import { parseUtc, useAllEntries } from "./water";

type Entry = typeof waterEntries.$inferSelect;

export type DayGroup = {
	key: string;
	date: Date;
	totalMl: number;
	entries: Entry[];
};

export type WeekDay = {
	date: Date;
	totalMl: number;
	goalMet: boolean;
};

const EMPTY: Entry[] = [];

export function useHistory() {
	const entries = useAllEntries() ?? EMPTY;

	return useMemo(() => {
		// Group entries by local calendar day, newest first
		const groups = new Map<string, DayGroup>();
		for (const entry of entries) {
			const date = parseUtc(entry.loggedAt);
			const key = date.toDateString();
			const group = groups.get(key) ?? { key, date, totalMl: 0, entries: [] };
			group.totalMl += entry.amountMl;
			group.entries.push(entry);
			groups.set(key, group);
		}

		// Last 7 local days, oldest first, today last
		const week: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setHours(0, 0, 0, 0);
			date.setDate(date.getDate() - (6 - i));
			const totalMl = groups.get(date.toDateString())?.totalMl ?? 0;
			return { date, totalMl, goalMet: totalMl >= DAILY_GOAL_ML };
		});

		// Average of the six completed days, excluding today
		const average = Math.round(
			week.slice(0, 6).reduce((sum, d) => sum + d.totalMl, 0) / 6,
		);
		const goalCount = week.filter((d) => d.goalMet).length;

		return { days: [...groups.values()], week, average, goalCount };
	}, [entries]);
}
