import { db } from "./init";
import { logsTable } from "./schema";
import { desc, eq, lte, sql } from "drizzle-orm";
import { formatDateKey, getTodayKey } from "@/lib/dates";

export const getAllEntriesQuery = () => db.select().from(logsTable).orderBy(desc(logsTable.id))
export const getTodayEntry = () => db.select().from(logsTable).where(eq(logsTable.log_date, getTodayKey()))

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
                count: sql`${logsTable.count} + 1`
            },
        });
};


export async function getStreak(goal: number): Promise<number> {
  const todayKey = getTodayKey()

  // 1. Fetch all records from today backwards, ordered newest to oldest
  const records = await db
    .select()
    .from(logsTable)
    .where(lte(logsTable.log_date, todayKey))
    .orderBy(desc(logsTable.log_date));

  // 2. Convert database rows into a quick-lookup Record object: { "2026-11-07": 5 }
  const logMap: Record<string, number> = {};
  for (const row of records) {
    logMap[row.log_date] = row.count;
  }

  const cursor = new Date();

  // 3. Today hasn't met the goal yet: start counting from yesterday instead
  if ((logMap[formatDateKey(cursor)] ?? 0) < goal) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  // 4. Iterate backwards day by day to count the continuous streak
  while (streak < 365 && (logMap[formatDateKey(cursor)] ?? 0) >= goal) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
