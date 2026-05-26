CREATE TABLE "portfolio_positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"asset_symbol" text NOT NULL,
	"quantity" numeric(20, 6) NOT NULL,
	"entry_price" numeric(20, 6) NOT NULL,
	"entry_date" date NOT NULL,
	"goal" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portfolio_positions" ADD CONSTRAINT "portfolio_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;