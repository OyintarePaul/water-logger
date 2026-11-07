import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { formatDateKey } from "@/lib/dates";
import { colors, fonts, spacing } from "@/lib/theme";
import { getStreakQuery } from "@/db/queries";

export function StreakTracker({ goal }: { goal: number }) {
	const todayKey = formatDateKey(new Date());

	const { data: records } = useLiveQuery(getStreakQuery(goal));

	const streak = useMemo(() => {
		if (!records || records.length === 0) return 0;

		// Convert rows into a map for fast O(1) day-by-day lookups
		const logMap: Record<string, number> = {};
		for (const row of records) {
			logMap[row.log_date] = row.count;
		}

		const cursor = new Date();

		// Today hasn't met the goal yet: start counting from yesterday instead
		if ((logMap[formatDateKey(cursor)] ?? 0) < goal) {
			cursor.setDate(cursor.getDate() - 1);
		}

		let currentStreak = 0;
		while (
			currentStreak < 365 &&
			(logMap[formatDateKey(cursor)] ?? 0) >= goal
		) {
			currentStreak++;
			cursor.setDate(cursor.getDate() - 1);
		}

		return currentStreak;
	}, [records, goal]); // Dependency array keeps calculation bound to real-time updates

	if (streak > 0)
		return (
			<View style={styles.streakPill}>
				<Text style={styles.streakText}>🔥 {streak}-day streak</Text>
			</View>
		);
}

const styles = StyleSheet.create({
	streakPill: {
		alignSelf: "flex-start",
		backgroundColor: "#FFF4E0",
		borderRadius: 20,
		paddingVertical: 6,
		paddingHorizontal: 12,
		marginBottom: spacing.lg,
	},
	streakText: {
		fontFamily: fonts.bold,
		fontSize: 14,
		color: colors.muted,
	},
});
