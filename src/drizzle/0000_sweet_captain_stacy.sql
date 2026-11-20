CREATE TABLE `water_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`amount_ml` integer NOT NULL,
	`logged_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
