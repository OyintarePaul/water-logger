import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const userSettings = sqliteTable('user_settings', {
  id: integer('id').primaryKey(),
  dailyGoalMl: integer('daily_goal_ml').default(3000).notNull(),
  onboardingCompleted: integer('onboarding_completed').default(0).notNull(),
  remindersEnabled: integer('reminders_enabled').default(1).notNull(),
  reminderIntervalMins: integer('reminder_interval_mins').default(120).notNull(),
  quietHoursStart: text('quiet_hours_start').default('22:00').notNull(),
  quietHoursEnd: text('quiet_hours_end').default('07:00').notNull(),
});

export const intakeLogs = sqliteTable('intake_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  presetType: text('preset_type').notNull(), // 'sip', 'half_sachet', 'full_sachet', 'small_cup', 'large_cup', 'small_bottle'
  amountMl: integer('amount_ml').notNull(), // 50, 250, 500, 750, 200, 400, 500
  loggedAt: text('logged_at').notNull(), // ISO 8601 string
});