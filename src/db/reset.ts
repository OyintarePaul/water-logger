import { usersTable, logsTable } from "./schema";
import { db } from "./client";

export async function resetDatabaseFile() {
	try {
		await db.delete(usersTable);
		await db.delete(logsTable);
		console.log("Deleted tables");
	} catch (error) {
		console.error("Failed to delete database file:", error);
	}
}

export async function seedLogsDatabase() {
  const seedData = [
    { log_date: '2026-11-07', count: 5 }, // Today
    { log_date: '2026-11-06', count: 4 }, // Yesterday
    { log_date: '2026-11-05', count: 3 },
    { log_date: '2026-11-04', count: 0 },
    { log_date: '2026-11-03', count: 1 }, // Potential streak breaker depending on your goal!
    { log_date: '2026-11-02', count: 4 },
    { log_date: '2026-11-01', count: 5 },
    { log_date: '2026-10-31', count: 3 },
    { log_date: '2026-10-30', count: 6 }, // Missed day
    { log_date: '2026-10-29', count: 4 },
  ];

  try {
    // Using onConflictDoUpdate so you can run this script multiple times safely without crashing
    for (const row of seedData) {
      await db
        .insert(logsTable)
        .values(row)
        .onConflictDoUpdate({
          target: [logsTable.log_date],
          set: { count: row.count },
        });
    }
    console.log('✅ Database seeded successfully with 10 days of logs!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
