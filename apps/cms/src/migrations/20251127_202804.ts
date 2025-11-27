import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_variants_additional_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products_variants_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"coordinates" geometry(Point),
  	"map_url" varchar,
  	"address" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  ALTER TABLE "products_locations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_locations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" integer;
  ALTER TABLE "products_variants_additional_info" ADD CONSTRAINT "products_variants_additional_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_locations" ADD CONSTRAINT "products_variants_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_variants_additional_info_order_idx" ON "products_variants_additional_info" USING btree ("_order");
  CREATE INDEX "products_variants_additional_info_parent_id_idx" ON "products_variants_additional_info" USING btree ("_parent_id");
  CREATE INDEX "products_variants_locations_order_idx" ON "products_variants_locations" USING btree ("_order");
  CREATE INDEX "products_variants_locations_parent_id_idx" ON "products_variants_locations" USING btree ("_parent_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_products_id_idx" ON "search_rels" USING btree ("products_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"coordinates" geometry(Point),
  	"map_url" varchar,
  	"address" varchar
  );
  
  ALTER TABLE "products_variants_additional_info" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_variants_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_variants_additional_info" CASCADE;
  DROP TABLE "products_variants_locations" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_search_fk";
  
  DROP INDEX "payload_locked_documents_rels_search_id_idx";
  ALTER TABLE "products_locations" ADD CONSTRAINT "products_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_locations_order_idx" ON "products_locations" USING btree ("_order");
  CREATE INDEX "products_locations_parent_id_idx" ON "products_locations" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_id";`)
}
