import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useEffect, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressRing from "@/components/progress-ring";
import WeeklyChart from "@/components/weekly-chart";
import { getTodayKey } from "@/lib/dates";
import { colors, fonts, spacing } from "@/lib/theme";
import { getMotivation } from "@/lib/motivation";
import { getStreak, undoGlass } from "@/lib/water-storage";
import * as Haptics from "expo-haptics";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
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
	const [streak, setStreak] = useState(0);
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	useEffect(() => {
		getStreak(dailyGoal).then(setStreak);
	}, [dailyGoal]);

	let count: number = 0
	if (data.length > 0) {
		count = data[0].count
	}

	async function handleAdd() {
		await incrementToday();
		setStreak(await getStreak(dailyGoal));

		scale.value = withSequence(
			withTiming(1.2, { duration: 100 }),
			withTiming(1, { duration: 150 }),
		);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

		if (reminderEnabled && reminderId) {
			cancelNotification(reminderId);
			scheduleNotification({
				title: "Don't forget to drink",
				body: "It's an hour already, don't forget to hydrate"
			})
		}
	}

	async function handleUndo() {
		const next = await undoGlass(getTodayKey());
		setStreak(await getStreak(dailyGoal));
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
			<View style={styles.card}>
				<ProgressRing count={count} goal={dailyGoal}>
					<Animated.Text style={[styles.count, animatedStyle]}>
						{count}
					</Animated.Text>
					<Text style={styles.goal}>/ {dailyGoal} glasses</Text>
				</ProgressRing>
				<Text style={styles.motivation}>{getMotivation(count, dailyGoal)}</Text>
			</View>
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
	root: {
		flex: 1,
		backgroundColor: colors.background,
	},
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background,
	},
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

	card: {
		backgroundColor: colors.card,
		borderRadius: 20,
		padding: spacing.lg,
		alignItems: "center",
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: "#E0EEF5",
	},
	count: {
		fontFamily: fonts.bold,
		fontSize: 64,
		lineHeight: 72,
		color: colors.primary,
		textAlign: "center",
		includeFontPadding: false,
	},
	goal: {
		fontFamily: fonts.regular,
		fontSize: 16,
		color: colors.muted,
		marginTop: spacing.sm,
		textAlign: "center",
	},
	motivation: {
		fontFamily: fonts.regular,
		fontSize: 15,
		color: colors.muted,
		marginTop: spacing.md,
		textAlign: "center",
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
