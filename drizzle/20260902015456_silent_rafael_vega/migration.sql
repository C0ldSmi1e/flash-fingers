CREATE TABLE `content` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`text` text NOT NULL UNIQUE,
	`char_count` integer GENERATED ALWAYS AS (length(text)) STORED,
	`word_count` integer GENERATED ALWAYS AS (length(trim(text)) - length(replace(trim(text), ' ', '')) + 1) STORED,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "content_text_ascii" CHECK("text" NOT GLOB '*[^ -~]*')
);
