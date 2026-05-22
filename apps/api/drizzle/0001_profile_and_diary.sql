CREATE TYPE "public"."diary_action" AS ENUM('observe', 'buy', 'sell', 'hold');--> statement-breakpoint
CREATE TYPE "public"."diary_horizon" AS ENUM('1m', '3m', '1y', 'long');--> statement-breakpoint
CREATE TYPE "public"."diary_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."knowledge_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."preferred_locale" AS ENUM('ru', 'en');--> statement-breakpoint
CREATE TABLE "diary_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"asset_symbol" text NOT NULL,
	"action" "diary_action" NOT NULL,
	"horizon" "diary_horizon" NOT NULL,
	"rationale" text,
	"risks" text,
	"success_criteria" text,
	"failure_criteria" text,
	"confidence" smallint,
	"status" "diary_status" DEFAULT 'active' NOT NULL,
	"review_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "knowledge_level" "knowledge_level" DEFAULT 'beginner' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_locale" "preferred_locale" DEFAULT 'ru' NOT NULL;--> statement-breakpoint
ALTER TABLE "diary_entries" ADD CONSTRAINT "diary_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;