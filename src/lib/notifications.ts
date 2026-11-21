import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Settings } from '@/db/queries/settings';

const CHANNEL_ID = 'reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Water reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  } catch (error) {
    console.warn('Could not create reminder channel', error);
  }
}

// Asks for permission if needed. Returns true only if the user allows notifications.
export async function requestReminderPermission() {
  const current = await Notifications.getPermissionsAsync();
  const granted = current.granted || (await Notifications.requestPermissionsAsync()).granted;
  if (granted) await ensureChannel();
  return granted;
}

// Today's reminder times, one interval after the last log (or from the start hour).
export function computeReminderTimes(settings: Settings, now: Date, lastLogAt: Date | null) {
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
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Skip when reminders are off or the goal is already met
  if (!settings.remindersEnabled || totalMl >= settings.dailyGoalMl) return;

  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return;

  const remaining = settings.dailyGoalMl - totalMl;
  const times = computeReminderTimes(settings, new Date(), lastLogAt);

    console.log(
      'reminders sync:',
      'interval', settings.reminderIntervalMin,
      'goal', settings.dailyGoalMl,
      'total', totalMl,
      'times', times.map((t) => t.toLocaleTimeString()),
    );

  await Promise.all(
    times.map((date) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for a drink 💧',
          body: `${remaining.toLocaleString()} ml to go today`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: CHANNEL_ID,
        },
      }),
    ),
  );
}


// Temporary test: fires one notification in 10 seconds and logs what is scheduled
export async function debugTestNotification() {
  await ensureChannel();
  const { granted } = await Notifications.getPermissionsAsync();
  console.log('permission granted:', granted);

  await Notifications.scheduleNotificationAsync({
    content: { title: 'Test reminder', body: 'If you see this, scheduling works' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      channelId: CHANNEL_ID,
    },
  });

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('scheduled count:', scheduled.length);
}
