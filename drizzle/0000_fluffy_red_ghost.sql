CREATE TABLE "complaints_and_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_code" varchar(21) NOT NULL,
	"altcha_nonce" varchar(32) NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100),
	"mobile" varchar(20),
	"email" varchar(320),
	"student_id" varchar(30),
	"department" varchar(160) NOT NULL,
	"feedback_type" varchar(32) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "complaints_and_feedback_tracking_code_unique" UNIQUE("tracking_code"),
	CONSTRAINT "complaints_and_feedback_altcha_nonce_unique" UNIQUE("altcha_nonce")
);
