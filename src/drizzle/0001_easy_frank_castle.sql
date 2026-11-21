CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`daily_goal_ml` integer DEFAULT 2500 NOT NULL,
	`reminders_enabled` integer DEFAULT false NOT NULL,
	`reminder_interval_min` integer DEFAULT 120 NOT NULL,
	`reminder_start_hour` integer DEFAULT 8 NOT NULL,
	`reminder_end_hour` integer DEFAULT 22 NOT NULL,
	`onboarding_completed` integer DEFAULT false NOT NULL
);
