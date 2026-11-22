import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Settings } from "@/db/queries/settings";

const CHANNEL_ID = "reminders";

// Android allows 500 scheduled alarms per app. Stay well under it.
export const MAX_SCHEDULED_REMINDERS = 60;

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

async function ensureChannel() {
	if (Platform.OS !== "android") return;
	try {
		await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
			name: "Water reminders",
			importance: Notifications.AndroidImportance.DEFAULT,
		});
	} catch (error) {
		console.warn("Could not create reminder channel", error);
	}
}

// Asks for permission if needed. Returns true only if the user allows notifications.
export async function requestReminderPermission() {
	const current = await Notifications.getPermissionsAsync();
	const granted =
		current.granted || (await Notifications.requestPermissionsAsync()).granted;
	if (granted) await ensureChannel();
	return granted;
}

// Today's reminder times, one interval after the last log (or from the start hour).
export function computeReminderTimes(
	settings: Settings,
	now: Date,
	lastLogAt: Date | null,
) {
	const intervalMs = settings.reminderIntervalMin * 60_000;

	const dayStart = new Date(now);
	dayStart.setHours(0, 0, 0, 0);

	const startAt = new Date(dayStart);
	startAt.setHours(settings.reminderStartHour);

	const endAt = new Date(dayStart);
	endAt.setHours(settings.reminderEndHour);

	// Base on the last log only if it happened today
	let next =
		lastLogAt && lastLogAt >= dayStart
			? new Date(lastLogAt.getTime() + intervalMs)
			: new Date(startAt);

	// Never before the reminder window opens
	if (next < startAt) next = new Date(startAt);

	// Never in the past
	while (next <= now) next = new Date(next.getTime() + intervalMs);

	const times: Date[] = [];
	for (let t = next; t <= endAt; t = new Date(t.getTime() + intervalMs)) {
		times.push(new Date(t));
	}
	return times;
}

type SyncInput = {
	settings: Settings;
	lastLogAt: Date | null;
	totalMl: number;
};

// Clears and rebuilds today's reminders. Call whenever settings or today's logs change.
export async function syncReminders({ settings, lastLogAt, totalMl }: SyncInput) {
  try {
    await ensureChannel();
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Skip when reminders are off or the goal is already met
    if (!settings.remindersEnabled || totalMl >= settings.dailyGoalMl) return;

    const { granted } = await Notifications.getPermissionsAsync();
    if (!granted) return;

    const remaining = settings.dailyGoalMl - totalMl;
    const times = computeReminderTimes(settings, new Date(), lastLogAt).slice(
      0,
      MAX_SCHEDULED_REMINDERS,
    );

    for (const date of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for a drink 💧',
          body: `${remaining.toLocaleString()} ml to go today`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: CHANNEL_ID,
        },
      });
    }
  } catch (error) {
    console.warn('Could not sync reminders', error);
  }
}
