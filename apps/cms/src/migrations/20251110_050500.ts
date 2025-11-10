import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TABLE "category" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar DEFAULT '',
  	"visible" boolean DEFAULT true,
  	"thumbnail_id" integer,
  	"parent_id" integer,
  	"handle" varchar,
  	"num_products" numeric,
  	"num_subcategories" numeric,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"coordinates" geometry(Point),
  	"map_url" varchar,
  	"address" varchar
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "products_variants" RENAME COLUMN "stock_count" TO "available";
  ALTER TABLE "products_custom_fields" ADD COLUMN "rich_text" varchar;
  ALTER TABLE "products_rels" ADD COLUMN "category_id" integer;
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "category_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_folders_id" integer;
  ALTER TABLE "category" ADD CONSTRAINT "category_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locations" ADD CONSTRAINT "products_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "category_thumbnail_idx" ON "category" USING btree ("thumbnail_id");
  CREATE INDEX "category_parent_idx" ON "category" USING btree ("parent_id");
  CREATE INDEX "category_handle_idx" ON "category" USING btree ("handle");
  CREATE INDEX "category_updated_at_idx" ON "category" USING btree ("updated_at");
  CREATE INDEX "category_created_at_idx" ON "category" USING btree ("created_at");
  CREATE INDEX "products_locations_order_idx" ON "products_locations" USING btree ("_order");
  CREATE INDEX "products_locations_parent_id_idx" ON "products_locations" USING btree ("_parent_id");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_rels_category_id_idx" ON "products_rels" USING btree ("category_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "payload_locked_documents_rels_category_id_idx" ON "payload_locked_documents_rels" USING btree ("category_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "category" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "category" CASCADE;
  DROP TABLE "products_locations" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_category_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_category_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_folders_fk";
  
  DROP INDEX "products_rels_category_id_idx";
  DROP INDEX "media_folder_idx";
  DROP INDEX "payload_locked_documents_rels_category_id_idx";
  DROP INDEX "payload_locked_documents_rels_payload_folders_id_idx";
  ALTER TABLE "products_variants" ADD COLUMN "stock_count" numeric DEFAULT 0;
  ALTER TABLE "products_variants" DROP COLUMN "available";
  ALTER TABLE "products_custom_fields" DROP COLUMN "rich_text";
  ALTER TABLE "products_rels" DROP COLUMN "category_id";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_folders_id";
  DROP TYPE "public"."enum_payload_folders_folder_type";`)
}
