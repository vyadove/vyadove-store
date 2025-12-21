import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
   ALTER TABLE "products_variants_locations" ALTER COLUMN "map_url" SET NOT NULL;
  ALTER TABLE "products_variants" ADD COLUMN "description" varchar;
  ALTER TABLE "products_variants" ADD COLUMN "participants_default" numeric DEFAULT 1 NOT NULL;
  ALTER TABLE "products_variants" ADD COLUMN "participants_min" numeric DEFAULT 1;
  ALTER TABLE "products_variants" ADD COLUMN "participants_max" numeric DEFAULT 20;
  ALTER TABLE "products" ADD COLUMN "validity" timestamp(3) with time zone;
  ALTER TABLE "checkout_items" ADD COLUMN "participants" numeric DEFAULT 1;
  ALTER TABLE "products_variants" DROP COLUMN "original_price";`);
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
   ALTER TABLE "products_variants_locations" ALTER COLUMN "map_url" DROP NOT NULL;
  ALTER TABLE "products_variants" ADD COLUMN "original_price" numeric;
  ALTER TABLE "products_variants" DROP COLUMN "description";
  ALTER TABLE "products_variants" DROP COLUMN "participants_default";
  ALTER TABLE "products_variants" DROP COLUMN "participants_min";
  ALTER TABLE "products_variants" DROP COLUMN "participants_max";
  ALTER TABLE "products" DROP COLUMN "validity";
  ALTER TABLE "checkout_items" DROP COLUMN "participants";`);
}
