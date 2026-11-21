import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DEFAULT_SETTINGS } from './constants';

export const waterEntries = sqliteTable("water_entries", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	label: text("label").notNull(),
	amountMl: integer("amount_ml").notNull(),
	loggedAt: text("logged_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});


// Single-row table: the app has one user, so the row always has id 1
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  dailyGoalMl: integer('daily_goal_ml').notNull().default(DEFAULT_SETTINGS.dailyGoalMl),
  remindersEnabled: integer('reminders_enabled', { mode: 'boolean' })
    .notNull()
    .default(DEFAULT_SETTINGS.remindersEnabled),
  reminderIntervalMin: integer('reminder_interval_min')
    .notNull()
    .default(DEFAULT_SETTINGS.reminderIntervalMin),
  reminderStartHour: integer('reminder_start_hour')
    .notNull()
    .default(DEFAULT_SETTINGS.reminderStartHour),
  reminderEndHour: integer('reminder_end_hour')
    .notNull()
    .default(DEFAULT_SETTINGS.reminderEndHour),
  onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' })
    .notNull()
    .default(DEFAULT_SETTINGS.onboardingCompleted),
});
