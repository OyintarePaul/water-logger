import { usersTable, logsTable } from "./schema";
import { db } from "./init";

export async function resetDatabaseFile() {
	try {
		await db.delete(usersTable);
		await db.delete(logsTable);
		console.log("Deleted tables");
	} catch (error) {
		console.error("Failed to delete database file:", error);
	}
}
