ALTER TABLE `records` ADD `started_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `records` ADD `ended_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `records` DROP COLUMN `total_time`;