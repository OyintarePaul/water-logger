import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	})
})

export const requestPermission = async () => {
	if (Platform.OS === "android") {
		try {
			await Notifications.setNotificationChannelAsync("default", {
				name: "Reminders",
				importance: Notifications.AndroidImportance.DEFAULT,
			});
		} catch (e) {
			console.warn("Channel setup failed:", e);
		}
	}
	const { status } = await Notifications.getPermissionsAsync();
	if (status === "granted") return true;
	const { status: newStatus } = await Notifications.requestPermissionsAsync();
	return newStatus === "granted";
}

type ScheduleOptions = {
	title: string;
	body: string;
	seconds?: number;
	date?: Date,
	data?: Record<string, unknown>
}

export const scheduleNotification = async ({
	title, body, seconds = 1, date, data
}: ScheduleOptions) => {
	const { status } = await Notifications.getPermissionsAsync();
	if (status !== "granted") return null
	const trigger: Notifications.SchedulableNotificationTriggerInput = date
		? { type: Notifications.SchedulableTriggerInputTypes.DATE, date }
		: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(1, seconds) }
	return Notifications.scheduleNotificationAsync({
		content: { title, body, data },
		trigger
	})
}

export const cancelNotification = async (id: string) => {
	if (id) {
		await Notifications.cancelScheduledNotificationAsync(id)
	} else {
		await Notifications.cancelAllScheduledNotificationsAsync();
	}
}


