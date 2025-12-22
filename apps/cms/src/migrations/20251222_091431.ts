import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "gift_message_enabled" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "gift_message_recipient_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "gift_message_sender_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "gift_message_message" varchar;
  ALTER TABLE "checkout" ADD COLUMN "gift_message_enabled" boolean DEFAULT false;
  ALTER TABLE "checkout" ADD COLUMN "gift_message_recipient_name" varchar;
  ALTER TABLE "checkout" ADD COLUMN "gift_message_sender_name" varchar;
  ALTER TABLE "checkout" ADD COLUMN "gift_message_message" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "gift_message_enabled";
  ALTER TABLE "orders" DROP COLUMN "gift_message_recipient_name";
  ALTER TABLE "orders" DROP COLUMN "gift_message_sender_name";
  ALTER TABLE "orders" DROP COLUMN "gift_message_message";
  ALTER TABLE "checkout" DROP COLUMN "gift_message_enabled";
  ALTER TABLE "checkout" DROP COLUMN "gift_message_recipient_name";
  ALTER TABLE "checkout" DROP COLUMN "gift_message_sender_name";
  ALTER TABLE "checkout" DROP COLUMN "gift_message_message";`)
}
