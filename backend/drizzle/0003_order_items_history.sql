CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL,
  "food_id" uuid NOT NULL,
  "food_name_snapshot" text NOT NULL,
  "food_image_snapshot" text,
  "unit_price" integer NOT NULL,
  "quantity" integer NOT NULL,
  "line_total" integer NOT NULL,
  "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "order_items"
ADD CONSTRAINT "order_items_order_id_orders_id_fk"
FOREIGN KEY ("order_id")
REFERENCES "public"."orders"("id")
ON DELETE no action
ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "order_items"
ADD CONSTRAINT "order_items_food_id_food_items_id_fk"
FOREIGN KEY ("food_id")
REFERENCES "public"."food_items"("id")
ON DELETE no action
ON UPDATE no action;
