import { db } from './client';
import { waterEntries } from './schema';
import { PRESETS } from './constants';

// Stored in UTC, matching the CURRENT_TIMESTAMP default format
function toUtcString(date: Date) {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export function seedWaterEntries() {
  const now = new Date();

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    // Varied totals so some days meet the goal and some don't
    const presetCount = [9, 4, 8, 3, 7, 5, 2][6 - daysAgo];

    for (let i = 0; i < presetCount; i++) {
      const preset = PRESETS[i % PRESETS.length];
      const when = new Date(now);
      when.setDate(now.getDate() - daysAgo);
      when.setHours(7 + i, (i * 13) % 60, 0, 0);

      // Skip times in the future for today
      if (when > now) continue;

      db.insert(waterEntries)
        .values({
          label: preset.label,
          amountMl: preset.amountMl,
          loggedAt: toUtcString(when),
        })
        .run();
    }
  }
}
