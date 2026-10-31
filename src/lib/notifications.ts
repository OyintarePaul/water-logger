import * as Notifications from 'expo-notifications';
import Storage from 'expo-sqlite/kv-store';

const NOTIFICATION_ID_KEY = 'reminder-notification-id';

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  await cancelReminder(); // cancel any existing one first
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to hydrate 💧',
      body: "Don't forget to log your water intake.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  await Storage.setItem(NOTIFICATION_ID_KEY, id);
}

export async function cancelReminder(): Promise<void> {
  const id = await Storage.getItem(NOTIFICATION_ID_KEY);
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
  await Storage.removeItem(NOTIFICATION_ID_KEY);
}