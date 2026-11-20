import { desc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from './client';
import { waterEntries } from './schema';

export const DAILY_GOAL_ML = 2000;

export const PRESETS = [
  { label: 'Sip', amountMl: 50 },
  { label: 'Half Sachet', amountMl: 250 },
  { label: 'Full Sachet', amountMl: 500 },
  { label: 'Small Cup', amountMl: 300 },
  { label: 'Small Bottle', amountMl: 300 },
  { label: 'Medium Cup', amountMl: 500 },
] as const;

// Timestamps are stored in UTC, so compare the local calendar day inside SQLite
const isToday = sql`date(${waterEntries.loggedAt}, 'localtime') = date('now', 'localtime')`;

export function logWater({ label, amountMl }: { label: string; amountMl: number }) {
  db.insert(waterEntries).values({ label, amountMl }).run();
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

export function formatTime(utcTimestamp: string) {
  // "YYYY-MM-DD HH:MM:SS" in UTC -> local time string
  const date = new Date(utcTimestamp.replace(' ', 'T') + 'Z');
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
