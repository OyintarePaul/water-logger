import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Host, Switch, Button, Text as JCText, Column } from "@expo/ui/jetpack-compose"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, spacing } from "@/lib/theme";
import { useSettingsStore } from "@/store/settingsStore";
import { requestPermission, scheduleNotification, cancelNotification } from "@/lib/notifications";
import Storage from 'expo-sqlite/kv-store';
import { seedDb } from "@/lib/water-storage";

const MIN_GOAL = 1;
const MAX_GOAL = 50;

export default function SettingsScreen() {
	const insets = useSafeAreaInsets();
	const { dailyGoal, reminderEnabled, updateSettings } = useSettingsStore();
	const [draft, setDraft] = useState(() => String(dailyGoal));


	async function commitGoal() {
		const parsed = parseInt(draft, 10);
		const valid =
			!Number.isNaN(parsed) && parsed >= MIN_GOAL && parsed <= MAX_GOAL;
		if (!valid) {
			setDraft(String(dailyGoal));
			return;
		}
		updateSettings({ dailyGoal: parsed });
		setDraft(String(parsed));
	}

	async function handleReminderToggle(enabled: boolean) {
		if (!enabled) {
			cancelNotification();
			updateSettings({ reminderEnabled: false, reminderId: null });
			return;
		}

		const granted = await requestPermission();
		const id = await scheduleNotification({
			title: "Don't forget to drink",
			body: "Don't forget to hydrate today",
			seconds: 3600
		})

		updateSettings({ reminderEnabled: granted, reminderId: id });
	}


	return (
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={[
				styles.container,
				{
					paddingTop: insets.top + spacing.lg,
					paddingBottom: insets.bottom + spacing.lg,
				},
			]}
			showsVerticalScrollIndicator={false}
		>
			<Text style={styles.title}>Settings</Text>

			<Text style={styles.sectionLabel}>Goal</Text>
			<View style={styles.card}>
				<View style={styles.row}>
					<Text style={styles.rowLabel}>Glasses per day</Text>
					<TextInput
						value={draft}
						onChangeText={setDraft}
						onBlur={commitGoal}
						onSubmitEditing={commitGoal}
						keyboardType="number-pad"
						maxLength={2}
						returnKeyType="done"
						style={styles.input}
					/>
				</View>
			</View>

			{/* Reminder */}
			<Text style={styles.sectionLabel}>Reminder</Text>
			<View style={styles.card}>
				<View style={styles.row}>
					<Text style={styles.rowLabel}>Setup Reminder</Text>
					<Host matchContents>
						<Switch value={reminderEnabled} colors={{
							checkedThumbColor: "#FFFFFF",
							checkedTrackColor: colors.primary,
							uncheckedThumbColor: colors.muted,
							uncheckedTrackColor: "#E0EEF5", // same as your card/input border
							uncheckedBorderColor: "#E0EEF5",
						}}
							onCheckedChange={handleReminderToggle}
						/>
					</Host>
				</View>
			</View>

			<Host matchContents>
				<Column>
					<Button onClick={seedDb}>
						<JCText>Seed DB</JCText>
					</Button>

					<Button onClick={() => Storage.clear()}>
						<JCText>Clear Data</JCText>
					</Button>
				</Column>
			</Host>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scroll: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		paddingHorizontal: spacing.lg,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 28,
		color: colors.text,
		marginBottom: spacing.lg,
	},
	sectionLabel: {
		fontFamily: fonts.bold,
		fontSize: 14,
		color: colors.muted,
		marginBottom: spacing.sm,
	},
	card: {
		backgroundColor: colors.card,
		borderRadius: 20,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: "#E0EEF5",
		marginBottom: spacing.lg,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rowLabel: {
		fontFamily: fonts.regular,
		fontSize: 16,
		color: colors.text,
	},
	input: {
		fontFamily: fonts.bold,
		fontSize: 18,
		color: colors.primary,
		minWidth: 56,
		textAlign: "center",
		borderWidth: 1,
		borderColor: "#E0EEF5",
		borderRadius: 12,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
	},
	timeRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: spacing.md,
	},
	timeText: {
		fontFamily: fonts.bold,
		fontSize: 16,
		color: colors.primary,
	},
	warning: {
		fontFamily: fonts.regular,
		fontSize: 14,
		color: colors.muted,
		marginTop: spacing.md,
	},
});
