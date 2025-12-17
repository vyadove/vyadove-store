import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'failed' AND enumtypid = 'public.enum_orders_order_status'::regtype) THEN
      ALTER TYPE "public"."enum_orders_order_status" ADD VALUE 'failed' BEFORE 'delivered';
    END IF;
  END $$;
  DROP TABLE IF EXISTS "carts_cart_items" CASCADE;
  DROP TABLE IF EXISTS "carts" CASCADE;
  DROP TABLE IF EXISTS "checkout_sessions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_carts_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_checkout_sessions_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_carts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_checkout_sessions_id_idx";
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripe_session_id" varchar;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_logo_id" integer;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_primary_color" varchar DEFAULT '#000000';
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_accent_color" varchar DEFAULT '#666666';
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_footer_text" varchar DEFAULT '© {{current_year}} Vyadove. All rights reserved.';
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_address" varchar;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_social_links_facebook" varchar;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_social_links_instagram" varchar;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_social_links_twitter" varchar;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_social_links_linkedin" varchar;
  ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "email_branding_unsubscribe_url" varchar;
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'store_settings_email_branding_logo_id_media_id_fk') THEN
      ALTER TABLE "store_settings" ADD CONSTRAINT "store_settings_email_branding_logo_id_media_id_fk" FOREIGN KEY ("email_branding_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "store_settings_email_branding_email_branding_logo_idx" ON "store_settings" USING btree ("email_branding_logo_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "carts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "checkout_sessions_id";`);
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
   CREATE TABLE "carts_cart_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant_id" varchar NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar,
  	"customer_id" integer,
  	"completed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "checkout_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar,
  	"customer_id" integer,
  	"cart_id" integer NOT NULL,
  	"shipping_id" integer,
  	"payment_id" integer,
  	"shipping_address" jsonb,
  	"billing_address" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "store_settings" DROP CONSTRAINT "store_settings_email_branding_logo_id_media_id_fk";
  
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_orders_order_status";
  CREATE TYPE "public"."enum_orders_order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'canceled');
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending'::"public"."enum_orders_order_status";
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE "public"."enum_orders_order_status" USING "order_status"::"public"."enum_orders_order_status";
  DROP INDEX "store_settings_email_branding_email_branding_logo_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "carts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "checkout_sessions_id" integer;
  ALTER TABLE "carts_cart_items" ADD CONSTRAINT "carts_cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_cart_items" ADD CONSTRAINT "carts_cart_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_shipping_id_shipping_id_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "carts_cart_items_order_idx" ON "carts_cart_items" USING btree ("_order");
  CREATE INDEX "carts_cart_items_parent_id_idx" ON "carts_cart_items" USING btree ("_parent_id");
  CREATE INDEX "carts_cart_items_product_idx" ON "carts_cart_items" USING btree ("product_id");
  CREATE INDEX "carts_customer_idx" ON "carts" USING btree ("customer_id");
  CREATE INDEX "carts_updated_at_idx" ON "carts" USING btree ("updated_at");
  CREATE INDEX "carts_created_at_idx" ON "carts" USING btree ("created_at");
  CREATE INDEX "checkout_sessions_customer_idx" ON "checkout_sessions" USING btree ("customer_id");
  CREATE INDEX "checkout_sessions_cart_idx" ON "checkout_sessions" USING btree ("cart_id");
  CREATE INDEX "checkout_sessions_shipping_idx" ON "checkout_sessions" USING btree ("shipping_id");
  CREATE INDEX "checkout_sessions_payment_idx" ON "checkout_sessions" USING btree ("payment_id");
  CREATE INDEX "checkout_sessions_updated_at_idx" ON "checkout_sessions" USING btree ("updated_at");
  CREATE INDEX "checkout_sessions_created_at_idx" ON "checkout_sessions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carts_fk" FOREIGN KEY ("carts_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_checkout_sessions_fk" FOREIGN KEY ("checkout_sessions_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("carts_id");
  CREATE INDEX "payload_locked_documents_rels_checkout_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("checkout_sessions_id");
  ALTER TABLE "orders" DROP COLUMN "stripe_session_id";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_logo_id";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_primary_color";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_accent_color";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_footer_text";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_address";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_social_links_facebook";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_social_links_instagram";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_social_links_twitter";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_social_links_linkedin";
  ALTER TABLE "store_settings" DROP COLUMN "email_branding_unsubscribe_url";`);
}
