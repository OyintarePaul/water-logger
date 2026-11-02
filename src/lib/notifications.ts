import * as Notifications from 'expo-notifications';
import Storage from 'expo-sqlite/kv-store';
import { Platform } from 'react-native';
import { getSettings } from '@/lib/settings-storage';

const NOTIFICATION_ID_KEY = 'reminder-notification-id';
const CHANNEL_ID = 'reminders';

// Android 13+ won't show the permission prompt until a channel exists.
// Returns false instead of throwing if the native module isn't available.
async function ensureChannel(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    return true;
  } catch (e) {
    console.warn('Could not create notification channel', e);
    return false;
  }
}

// Asks the user for permission if needed. Returns true if notifications are allowed.
export async function requestReminderPermission(): Promise<boolean> {
  try {
    const channelReady = await ensureChannel();
    if (!channelReady) return false;
    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted') return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === 'granted';
  } catch (e) {
    console.warn('Notification permission failed', e);
    return false;
  }
}

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  try {
    await cancelReminder(); // cancel any existing one first
    await ensureChannel();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to hydrate 💧',
        body: "Don't forget to log your water intake.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: CHANNEL_ID,
      },
    });
    await Storage.setItem(NOTIFICATION_ID_KEY, id);
  } catch (e) {
    console.warn('Could not schedule reminder', e);
  }
}

export async function cancelReminder(): Promise<void> {
  try {
    const id = await Storage.getItem(NOTIFICATION_ID_KEY);
    if (id) await Notifications.cancelScheduledNotificationAsync(id);
    await Storage.setItem(NOTIFICATION_ID_KEY, '');
  } catch (e) {
    console.warn('Could not cancel reminder', e);
  }
}

// Re-schedules the reminder on app start, if it's enabled and still permitted.
export async function restoreReminder(): Promise<void> {
  try {
    const settings = await getSettings();
    if (!settings.reminderEnabled) return;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    await scheduleReminder(settings.reminderHour, settings.reminderMinute);
  } catch (e) {
    console.warn('Could not restore reminder', e);
  }
}