import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const waterEntries = sqliteTable("water_entries", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	label: text("label").notNull(),
	amountMl: integer("amount_ml").notNull(),
	loggedAt: text("logged_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
