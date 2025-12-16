import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
   CREATE TYPE "public"."enum_products_variants_pricing_tier" AS ENUM('basic', 'premium', 'luxury');
  ALTER TABLE "products_variant_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_variant_options" CASCADE;
  DROP TABLE "products_texts" CASCADE;
  ALTER TABLE "products_custom_fields" ALTER COLUMN "value" SET NOT NULL;
  ALTER TABLE "products_variants" ADD COLUMN "pricing_tier" "enum_products_variants_pricing_tier" DEFAULT 'basic' NOT NULL;
  ALTER TABLE "products_custom_fields" DROP COLUMN "rich_text";`);
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
   CREATE TABLE "products_variant_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar NOT NULL
  );
  
  CREATE TABLE "products_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "products_custom_fields" ALTER COLUMN "value" DROP NOT NULL;
  ALTER TABLE "products_custom_fields" ADD COLUMN "rich_text" varchar;
  ALTER TABLE "products_variant_options" ADD CONSTRAINT "products_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_texts" ADD CONSTRAINT "products_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_variant_options_order_idx" ON "products_variant_options" USING btree ("_order");
  CREATE INDEX "products_variant_options_parent_id_idx" ON "products_variant_options" USING btree ("_parent_id");
  CREATE INDEX "products_texts_order_parent_idx" ON "products_texts" USING btree ("order","parent_id");
  ALTER TABLE "products_variants" DROP COLUMN "pricing_tier";
  DROP TYPE "public"."enum_products_variants_pricing_tier";`);
}
