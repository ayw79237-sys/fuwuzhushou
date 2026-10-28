import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const userRecords = sqliteTable("user_records", {
  userId: text("user_id").primaryKey(),
  revision: integer("revision").notNull().default(0),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});
