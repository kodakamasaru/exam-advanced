CREATE TABLE "analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"text" text NOT NULL,
	"total_words" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_frequency" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysis_id" uuid NOT NULL,
	"word" text NOT NULL,
	"count" integer NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"rank" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "word_frequency" ADD CONSTRAINT "word_frequency_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE cascade ON UPDATE no action;