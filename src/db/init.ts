import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const DB_NAME = "logs_db.db";
const expo = SQLite.openDatabaseSync(DB_NAME, { enableChangeListener: true });

export const db = drizzle(expo);
