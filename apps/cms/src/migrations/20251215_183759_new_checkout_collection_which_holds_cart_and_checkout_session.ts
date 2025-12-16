import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
   CREATE TYPE "public"."enum_checkout_status" AS ENUM('incomplete', 'complete', 'expired', 'cancelled');
  ALTER TYPE "public"."enum_orders_payment_status" ADD VALUE 'awaiting_payment' BEFORE 'paid';
  ALTER TYPE "public"."enum_orders_payment_status" ADD VALUE 'expired' BEFORE 'refunded';
  CREATE TABLE "checkout_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"variant_id" varchar NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"unit_price" numeric,
  	"total_price" numeric
  );
  
  CREATE TABLE "checkout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"customer_id" integer,
  	"shipping_address" jsonb,
  	"billing_address" jsonb,
  	"shipping_method_id" integer,
  	"payment_id" integer,
  	"payment_intent_id" varchar,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"subtotal" numeric DEFAULT 0,
  	"shipping_total" numeric DEFAULT 0,
  	"tax_total" numeric DEFAULT 0,
  	"discount_total" numeric DEFAULT 0,
  	"total" numeric DEFAULT 0 NOT NULL,
  	"voucher_code" varchar,
  	"gift_card_id" integer,
  	"customer_note" varchar,
  	"email" varchar,
  	"status" "enum_checkout_status" DEFAULT 'incomplete' NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "products_variants" RENAME COLUMN "price" TO "price_amount";
  ALTER TABLE "orders" DROP CONSTRAINT "orders_cart_id_carts_id_fk";
  
  DROP INDEX "orders_cart_idx";
  ALTER TABLE "orders" ADD COLUMN "checkout_id" integer NOT NULL;
  ALTER TABLE "products_variants" ADD COLUMN "price_currency" varchar DEFAULT 'USD';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "checkout_id" integer;
  ALTER TABLE "checkout_items" ADD CONSTRAINT "checkout_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_items" ADD CONSTRAINT "checkout_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."checkout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "checkout" ADD CONSTRAINT "checkout_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout" ADD CONSTRAINT "checkout_shipping_method_id_shipping_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout" ADD CONSTRAINT "checkout_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout" ADD CONSTRAINT "checkout_gift_card_id_gift_cards_id_fk" FOREIGN KEY ("gift_card_id") REFERENCES "public"."gift_cards"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "checkout_items_order_idx" ON "checkout_items" USING btree ("_order");
  CREATE INDEX "checkout_items_parent_id_idx" ON "checkout_items" USING btree ("_parent_id");
  CREATE INDEX "checkout_items_product_idx" ON "checkout_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "checkout_session_id_idx" ON "checkout" USING btree ("session_id");
  CREATE INDEX "checkout_customer_idx" ON "checkout" USING btree ("customer_id");
  CREATE INDEX "checkout_shipping_method_idx" ON "checkout" USING btree ("shipping_method_id");
  CREATE INDEX "checkout_payment_idx" ON "checkout" USING btree ("payment_id");
  CREATE INDEX "checkout_gift_card_idx" ON "checkout" USING btree ("gift_card_id");
  CREATE INDEX "checkout_updated_at_idx" ON "checkout" USING btree ("updated_at");
  CREATE INDEX "checkout_created_at_idx" ON "checkout" USING btree ("created_at");
  ALTER TABLE "orders" ADD CONSTRAINT "orders_checkout_id_checkout_id_fk" FOREIGN KEY ("checkout_id") REFERENCES "public"."checkout"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_checkout_fk" FOREIGN KEY ("checkout_id") REFERENCES "public"."checkout"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_checkout_idx" ON "orders" USING btree ("checkout_id");
  CREATE INDEX "payload_locked_documents_rels_checkout_id_idx" ON "payload_locked_documents_rels" USING btree ("checkout_id");
  ALTER TABLE "orders" DROP COLUMN "cart_id";`);
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
   ALTER TABLE "checkout_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "checkout" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "checkout_items" CASCADE;
  DROP TABLE "checkout" CASCADE;
  ALTER TABLE "orders" DROP CONSTRAINT "orders_checkout_id_checkout_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_checkout_fk";
  
  ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_orders_payment_status";
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'pending'::"public"."enum_orders_payment_status";
  ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DATA TYPE "public"."enum_orders_payment_status" USING "payment_status"::"public"."enum_orders_payment_status";
  DROP INDEX "orders_checkout_idx";
  DROP INDEX "payload_locked_documents_rels_checkout_id_idx";
  ALTER TABLE "orders" ADD COLUMN "cart_id" integer;
  ALTER TABLE "products_variants" ADD COLUMN "price" numeric NOT NULL;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "orders_cart_idx" ON "orders" USING btree ("cart_id");
  ALTER TABLE "orders" DROP COLUMN "checkout_id";
  ALTER TABLE "products_variants" DROP COLUMN "price_amount";
  ALTER TABLE "products_variants" DROP COLUMN "price_currency";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "checkout_id";
  DROP TYPE "public"."enum_checkout_status";`);
}
