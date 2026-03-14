ALTER TABLE "users" ADD COLUMN "phone" varchar(20);
ALTER TABLE "users" ADD COLUMN "avatar" text;

CREATE TABLE "addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "label" varchar(50) NOT NULL,
  "line_1" text NOT NULL,
  "line_2" text,
  "city" varchar(120) NOT NULL,
  "state" varchar(120) NOT NULL,
  "postal_code" varchar(20) NOT NULL,
  "landmark" text,
  "is_default" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "addresses_user_id_users_id_fk"
    FOREIGN KEY ("user_id")
    REFERENCES "public"."users"("id")
    ON DELETE no action
    ON UPDATE no action
);
