import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_collections\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text DEFAULT '' NOT NULL,
  	\`image_url\` text,
  	\`handle\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_collections\`("id", "title", "description", "image_url", "handle", "meta_title", "meta_description", "updated_at", "created_at") SELECT "id", "title", "description", "image_url", "handle", "meta_title", "meta_description", "updated_at", "created_at" FROM \`collections\`;`)
  await db.run(sql`DROP TABLE \`collections\`;`)
  await db.run(sql`ALTER TABLE \`__new_collections\` RENAME TO \`collections\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`collections_handle_idx\` ON \`collections\` (\`handle\`);`)
  await db.run(sql`CREATE INDEX \`collections_updated_at_idx\` ON \`collections\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`collections_created_at_idx\` ON \`collections\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`collections\` ADD \`thumbnail_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`collections_thumbnail_idx\` ON \`collections\` (\`thumbnail_id\`);`)
}
