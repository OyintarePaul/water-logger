import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations"
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const expoDb = openDatabaseSync('waterlogger.db', { enableChangeListener: true });
export const db = drizzle(expoDb, { schema } as any);

export async function runDatabaseMigrations() {
  try {
    await migrate(db, migrations);
    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

export async function initializeDatabase() {
  try {
    const existingSettings = await db
      .select()
      .from(schema.userSettings)
      .where(eq(schema.userSettings.id, 1))

    if (existingSettings.length === 0) {
      await db.insert(schema.userSettings).values({
        id: 1,
        dailyGoalMl: 3000,
        onboardingCompleted: 0,
        remindersEnabled: 1,
        reminderIntervalMins: 120,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      })
    }
  } catch (error) {
    console.error('Failed to initialize database settings:', error);
  }
}