CREATE TABLE "weekly_market_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" timestamp with time zone NOT NULL,
	"locale" text NOT NULL,
	"content" jsonb NOT NULL,
	"source" text NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "weekly_market_reviews_week_locale_idx" ON "weekly_market_reviews" USING btree ("week_start","locale");