import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_collections\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`image_id\` integer,
  	\`image_url\` text,
  	\`handle\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_collections\`("id", "title", "description", "image_id", "image_url", "handle", "meta_title", "meta_description", "updated_at", "created_at") SELECT "id", "title", "description", "image_id", "image_url", "handle", "meta_title", "meta_description", "updated_at", "created_at" FROM \`collections\`;`)
  await db.run(sql`DROP TABLE \`collections\`;`)
  await db.run(sql`ALTER TABLE \`__new_collections\` RENAME TO \`collections\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`collections_image_idx\` ON \`collections\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`collections_handle_idx\` ON \`collections\` (\`handle\`);`)
  await db.run(sql`CREATE INDEX \`collections_updated_at_idx\` ON \`collections\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`collections_created_at_idx\` ON \`collections\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pid\` text,
  	\`title\` text NOT NULL,
  	\`currency\` text,
  	\`visible\` integer DEFAULT true,
  	\`source\` text DEFAULT 'manual',
  	\`description\` text NOT NULL,
  	\`handle\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_products\`("id", "pid", "title", "currency", "visible", "source", "description", "handle", "meta_title", "meta_description", "updated_at", "created_at") SELECT "id", "pid", "title", "currency", "visible", "source", "description", "handle", "meta_title", "meta_description", "updated_at", "created_at" FROM \`products\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`ALTER TABLE \`__new_products\` RENAME TO \`products\`;`)
  await db.run(sql`CREATE INDEX \`products_handle_idx\` ON \`products\` (\`handle\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_store_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text DEFAULT 'Vya-dove',
  	\`currency\` text DEFAULT 'USD',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_store_settings\`("id", "name", "currency", "updated_at", "created_at") SELECT "id", "name", "currency", "updated_at", "created_at" FROM \`store_settings\`;`)
  await db.run(sql`DROP TABLE \`store_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_store_settings\` RENAME TO \`store_settings\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_collections\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`image_url\` text,
  	\`handle\` text,
  	\`description\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_collections\`("id", "title", "image_url", "handle", "description", "meta_title", "meta_description", "updated_at", "created_at") SELECT "id", "title", "image_url", "handle", "description", "meta_title", "meta_description", "updated_at", "created_at" FROM \`collections\`;`)
  await db.run(sql`DROP TABLE \`collections\`;`)
  await db.run(sql`ALTER TABLE \`__new_collections\` RENAME TO \`collections\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`collections_handle_idx\` ON \`collections\` (\`handle\`);`)
  await db.run(sql`CREATE INDEX \`collections_updated_at_idx\` ON \`collections\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`collections_created_at_idx\` ON \`collections\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pid\` text,
  	\`title\` text NOT NULL,
  	\`currency\` text,
  	\`visible\` integer DEFAULT true,
  	\`source\` text DEFAULT 'manual',
  	\`description\` text,
  	\`handle\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_products\`("id", "pid", "title", "currency", "visible", "source", "description", "handle", "meta_title", "meta_description", "updated_at", "created_at") SELECT "id", "pid", "title", "currency", "visible", "source", "description", "handle", "meta_title", "meta_description", "updated_at", "created_at" FROM \`products\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`ALTER TABLE \`__new_products\` RENAME TO \`products\`;`)
  await db.run(sql`CREATE INDEX \`products_handle_idx\` ON \`products\` (\`handle\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_store_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text DEFAULT 'ShopNex',
  	\`currency\` text DEFAULT 'USD',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_store_settings\`("id", "name", "currency", "updated_at", "created_at") SELECT "id", "name", "currency", "updated_at", "created_at" FROM \`store_settings\`;`)
  await db.run(sql`DROP TABLE \`store_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_store_settings\` RENAME TO \`store_settings\`;`)
}
