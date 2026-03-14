ALTER TABLE "orders" ADD COLUMN "address_id" uuid;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "currency" varchar(3) DEFAULT 'INR' NOT NULL;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" varchar(32) DEFAULT 'created' NOT NULL;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "razorpay_order_id" varchar(255);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "currency" varchar(3) DEFAULT 'INR' NOT NULL;
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "razorpay_order_id" varchar(255);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "razorpay_payment_id" varchar(255);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "razorpay_signature" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;
