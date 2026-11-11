CREATE TABLE `intake_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`preset_type` text NOT NULL,
	`amount_ml` integer NOT NULL,
	`logged_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` integer PRIMARY KEY,
	`daily_goal_ml` integer DEFAULT 3000 NOT NULL,
	`onboarding_completed` integer DEFAULT 0 NOT NULL,
	`reminders_enabled` integer DEFAULT 1 NOT NULL,
	`reminder_interval_mins` integer DEFAULT 120 NOT NULL,
	`quiet_hours_start` text DEFAULT '22:00' NOT NULL,
	`quiet_hours_end` text DEFAULT '07:00' NOT NULL
);
