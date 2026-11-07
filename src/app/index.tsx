import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WeeklyChart from "@/components/weekly-chart";
import { getTodayKey } from "@/lib/dates";
import { colors, fonts, spacing } from "@/lib/theme";
import Progress from "@/components/progress"
import { undoGlass } from "@/lib/water-storage";
import * as Haptics from "expo-haptics";
import {
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useSettingsStore } from "@/store/settingsStore";
import { cancelNotification, scheduleNotification } from "@/lib/notifications";

import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { getTodayEntry, incrementToday } from "@/db/queries";
import { StreakTracker } from "@/components/streak-tracker";

export default function HomeScreen() {
	const insets = useSafeAreaInsets();
	const { data } = useLiveQuery(getTodayEntry())
	const { dailyGoal, reminderEnabled, reminderId } = useSettingsStore();
	const scale = useSharedValue(1);

	let count = data[0]?.count ?? 0;

	async function handleAdd() {
		await incrementToday();
		scale.value = withSequence(
			withTiming(1.2, { duration: 100 }),
			withTiming(1, { duration: 150 }),
		);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

		if (reminderEnabled && reminderId) {
			cancelNotification(reminderId);
			scheduleNotification({
				title: "Don't forget to drink",
				body: "It's an hour already, don't forget to hydrate",
				seconds: 5,
			})
		}
	}

	async function handleUndo() {
		await undoGlass(getTodayKey());
	}

	return (
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={[
				styles.container,
				{ paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg },
			]}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.titleRow}>
				<MaterialDesignIcons name="water" size={28} color={colors.primary} />
				<Text style={styles.title}>Water</Text>
			</View>
			<StreakTracker goal={dailyGoal}/>
			<Progress dailyGoal={dailyGoal} todayCount={count} scale={scale} />
			<Pressable
				onPress={handleAdd}
				style={({ pressed }) => [
					styles.addButton,
					{ opacity: pressed ? 0.7 : 1 },
				]}
			>
				<MaterialDesignIcons name="water-plus" size={22} color="#fff" />
				<Text style={styles.addButtonText}>Add glass</Text>
			</Pressable>
			<Pressable
				onPress={handleUndo}
				style={({ pressed }) => [
					styles.undoButton,
					{ opacity: pressed ? 0.7 : 1 },
				]}
			>
				<MaterialDesignIcons
					name="undo-variant"
					size={18}
					color={colors.muted}
				/>
				<Text style={styles.undoButtonText}>Undo</Text>
			</Pressable>

			<WeeklyChart todayCount={count} goal={dailyGoal} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		paddingHorizontal: spacing.lg,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginTop: spacing.lg,
		marginBottom: spacing.md,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 28,
		color: colors.text,
	},	
	addButton: {
		backgroundColor: colors.primary,
		borderRadius: 20,
		paddingVertical: spacing.md,
		alignItems: "center",
		marginBottom: spacing.md,
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.sm,
	},
	addButtonText: {
		fontFamily: fonts.bold,
		fontSize: 18,
		color: "#FFFFFF",
	},
	undoButton: {
		alignItems: "center",
		paddingVertical: spacing.sm,
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.sm,
	},
	undoButtonText: {
		fontFamily: fonts.regular,
		fontSize: 16,
		color: colors.muted,
	},
});
