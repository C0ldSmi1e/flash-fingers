CREATE TABLE `records` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` text NOT NULL,
	`content_id` integer NOT NULL,
	`wpm` integer NOT NULL,
	`accuracy` integer NOT NULL,
	`typed_count` integer NOT NULL,
	`total_time` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_records_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_records_content_id_content_id_fk` FOREIGN KEY (`content_id`) REFERENCES `content`(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_records_rank` ON `records` (`user_id`,`wpm`);