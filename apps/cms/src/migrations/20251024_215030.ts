import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "themes_blocks_builder_io" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cj_settings_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cj_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "themes_blocks_builder_io" CASCADE;
  DROP TABLE "cj_settings_items" CASCADE;
  DROP TABLE "cj_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cj_settings_fk";
  
  ALTER TABLE "orders" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "source" SET DEFAULT 'manual'::text;
  DROP TYPE "public"."enum_orders_source";
  CREATE TYPE "public"."enum_orders_source" AS ENUM('manual');
  ALTER TABLE "orders" ALTER COLUMN "source" SET DEFAULT 'manual'::"public"."enum_orders_source";
  ALTER TABLE "orders" ALTER COLUMN "source" SET DATA TYPE "public"."enum_orders_source" USING "source"::"public"."enum_orders_source";
  ALTER TABLE "products" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "products" ALTER COLUMN "source" SET DEFAULT 'manual'::text;
  DROP TYPE "public"."enum_products_source";
  CREATE TYPE "public"."enum_products_source" AS ENUM('manual');
  ALTER TABLE "products" ALTER COLUMN "source" SET DEFAULT 'manual'::"public"."enum_products_source";
  ALTER TABLE "products" ALTER COLUMN "source" SET DATA TYPE "public"."enum_products_source" USING "source"::"public"."enum_products_source";
  DROP INDEX "payload_locked_documents_rels_cj_settings_id_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "collections" ADD COLUMN "visible" boolean DEFAULT true;
  ALTER TABLE "collections" ADD COLUMN "thumbnail_id" integer;
  ALTER TABLE "collections" ADD CONSTRAINT "collections_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "collections_thumbnail_idx" ON "collections" USING btree ("thumbnail_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cj_settings_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_orders_source" ADD VALUE 'cj';
  ALTER TYPE "public"."enum_products_source" ADD VALUE 'cj';
  CREATE TABLE "themes_blocks_builder_io" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"builder_io_public_key" varchar NOT NULL,
  	"builder_io_private_key" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "cj_settings_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_url" varchar
  );
  
  CREATE TABLE "cj_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email_address" varchar,
  	"api_token" varchar,
  	"refresh_token" varchar,
  	"refresh_token_expiry" timestamp(3) with time zone,
  	"access_token" varchar,
  	"access_token_expiry" timestamp(3) with time zone,
  	"pod_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "collections" DROP CONSTRAINT "collections_thumbnail_id_media_id_fk";
  
  DROP INDEX "collections_thumbnail_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cj_settings_id" integer;
  ALTER TABLE "themes_blocks_builder_io" ADD CONSTRAINT "themes_blocks_builder_io_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cj_settings_items" ADD CONSTRAINT "cj_settings_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cj_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cj_settings" ADD CONSTRAINT "cj_settings_pod_id_media_id_fk" FOREIGN KEY ("pod_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "themes_blocks_builder_io_order_idx" ON "themes_blocks_builder_io" USING btree ("_order");
  CREATE INDEX "themes_blocks_builder_io_parent_id_idx" ON "themes_blocks_builder_io" USING btree ("_parent_id");
  CREATE INDEX "themes_blocks_builder_io_path_idx" ON "themes_blocks_builder_io" USING btree ("_path");
  CREATE INDEX "cj_settings_items_order_idx" ON "cj_settings_items" USING btree ("_order");
  CREATE INDEX "cj_settings_items_parent_id_idx" ON "cj_settings_items" USING btree ("_parent_id");
  CREATE INDEX "cj_settings_pod_idx" ON "cj_settings" USING btree ("pod_id");
  CREATE INDEX "cj_settings_updated_at_idx" ON "cj_settings" USING btree ("updated_at");
  CREATE INDEX "cj_settings_created_at_idx" ON "cj_settings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cj_settings_fk" FOREIGN KEY ("cj_settings_id") REFERENCES "public"."cj_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_cj_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("cj_settings_id");
  ALTER TABLE "collections" DROP COLUMN "visible";
  ALTER TABLE "collections" DROP COLUMN "thumbnail_id";`)
}
