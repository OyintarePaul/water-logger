import { db } from "./init";
import { logsTable } from "./schema";
import { desc, eq, lte, sql, inArray } from "drizzle-orm";
import { formatDateKey, getTodayKey } from "@/lib/dates";

export const getAllEntriesQuery = () =>
	db.select().from(logsTable).orderBy(desc(logsTable.id));
export const getTodayEntry = () =>
	db.select().from(logsTable).where(eq(logsTable.log_date, getTodayKey()));

export const incrementToday = () => {
	const today = getTodayKey();

	return db
		.insert(logsTable)
		.values({
			log_date: today,
			count: 1,
		})
		.onConflictDoUpdate({
			target: [logsTable.log_date],
			set: {
				count: sql`${logsTable.count} + 1`,
			},
		});
};

export function getStreakQuery(goal: number) {
	const todayKey = getTodayKey()
	return db
			.select()
			.from(logsTable)
			.where(lte(logsTable.log_date, todayKey))
			.orderBy(desc(logsTable.log_date))
}

export function getLogsByDates(dates: string[]) {
  return db
    .select()
    .from(logsTable)
    .where(inArray(logsTable.log_date, dates))
	.orderBy(desc(logsTable.log_date));
}