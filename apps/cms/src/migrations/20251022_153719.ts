import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "privacy_policy_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"handle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "terms_and_conditions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"handle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "privacy_policy_page_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "terms_and_conditions_page_id" integer;
  CREATE INDEX "privacy_policy_page_handle_idx" ON "privacy_policy_page" USING btree ("handle");
  CREATE INDEX "privacy_policy_page_updated_at_idx" ON "privacy_policy_page" USING btree ("updated_at");
  CREATE INDEX "privacy_policy_page_created_at_idx" ON "privacy_policy_page" USING btree ("created_at");
  CREATE INDEX "terms_and_conditions_page_handle_idx" ON "terms_and_conditions_page" USING btree ("handle");
  CREATE INDEX "terms_and_conditions_page_updated_at_idx" ON "terms_and_conditions_page" USING btree ("updated_at");
  CREATE INDEX "terms_and_conditions_page_created_at_idx" ON "terms_and_conditions_page" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_privacy_policy_page_fk" FOREIGN KEY ("privacy_policy_page_id") REFERENCES "public"."privacy_policy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_terms_and_conditions_page_fk" FOREIGN KEY ("terms_and_conditions_page_id") REFERENCES "public"."terms_and_conditions_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_privacy_policy_page_id_idx" ON "payload_locked_documents_rels" USING btree ("privacy_policy_page_id");
  CREATE INDEX "payload_locked_documents_rels_terms_and_conditions_page_id_idx" ON "payload_locked_documents_rels" USING btree ("terms_and_conditions_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "privacy_policy_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_and_conditions_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "privacy_policy_page" CASCADE;
  DROP TABLE "terms_and_conditions_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_privacy_policy_page_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_terms_and_conditions_page_fk";
  
  DROP INDEX "payload_locked_documents_rels_privacy_policy_page_id_idx";
  DROP INDEX "payload_locked_documents_rels_terms_and_conditions_page_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "privacy_policy_page_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "terms_and_conditions_page_id";`)
}
