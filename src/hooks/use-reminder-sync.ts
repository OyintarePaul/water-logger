import { useEffect } from 'react';
import { useSettings } from '@/db/queries/settings';
import { parseUtc, useTodayEntries } from '@/db/queries/water';
import { syncReminders } from '@/lib/notifications';

export function useReminderSync() {
  const settings = useSettings();
  const entries = useTodayEntries() ?? [];

  const totalMl = entries.reduce((sum, e) => sum + e.amountMl, 0);
  const lastLoggedAt = entries[0]?.loggedAt ?? null; // newest first

  useEffect(() => {
    console.log("Resyncing Notifications...")
    syncReminders({
      settings,
      lastLogAt: lastLoggedAt ? parseUtc(lastLoggedAt) : null,
      totalMl,
    });
  }, [settings, lastLoggedAt, totalMl]);
}
