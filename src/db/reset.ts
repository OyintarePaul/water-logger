import { usersTable } from './schema';
import { db } from './init';

export async function resetDatabaseFile() {
    try {
        const deleted = await db.delete(usersTable).returning()
        console.log("Deleted users table")
    } catch (error) {
        console.error("Failed to delete database file:", error);
    }
}
