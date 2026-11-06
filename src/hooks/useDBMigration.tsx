import { db } from "@/db/init";
import migrations from "@/drizzle/migrations";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";

export default function useDBMigration() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        migrate(db, migrations)
            .then(() => setSuccess(true))
            .catch((err) => setError(err));
    })

    return { success, error }
}