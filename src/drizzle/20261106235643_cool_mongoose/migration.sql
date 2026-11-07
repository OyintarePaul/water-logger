PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_logs_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`log_date` text NOT NULL UNIQUE,
	`count` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_logs_table`(`id`, `log_date`, `count`) SELECT `id`, `log_date`, `count` FROM `logs_table`;--> statement-breakpoint
DROP TABLE `logs_table`;--> statement-breakpoint
ALTER TABLE `__new_logs_table` RENAME TO `logs_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;