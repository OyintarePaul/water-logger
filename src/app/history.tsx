import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, spacing } from "@/lib/theme";
import { getAllEntries, HistoryEntry } from "@/lib/water-storage";
import { useSettingsStore } from "@/store/settingsStore";

function formatDateLabel(dateKey: string): string {
	const date = new Date(dateKey + "T00:00:00");
	return date.toLocaleDateString(undefined, {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
}

export default function HistoryScreen() {
	const insets = useSafeAreaInsets();
	const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
	const dailyGoal = useSettingsStore((state) => state.dailyGoal);

	// Reload each time the tab is opened, so new glasses and goal changes show up
	useFocusEffect(
		useCallback(() => {
			getAllEntries().then((list) => setEntries(list))
		}, []),
	);

	if (entries === null) {
		return <View style={styles.loading} />;
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>History</Text>

			<View style={styles.card}>
				<FlatList
					data={entries}
					keyExtractor={(item) => item.dateKey}
					contentContainerStyle={styles.list}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
					ListEmptyComponent={
						<View style={styles.empty}>
							<Text style={styles.emptyText}>
								No history yet. Start logging today!
							</Text>
						</View>
					}
					renderItem={({ item }) => {
						const met = item.count >= dailyGoal;
						return (
							<View style={styles.row}>
								<View style={styles.rowText}>
									<Text style={styles.date}>
										{formatDateLabel(item.dateKey)}
									</Text>
									<Text style={styles.detail}>
										{item.count} / {dailyGoal} glasses
									</Text>
								</View>
								<MaterialDesignIcons
									name={met ? "check" : "minus"}
									size={met ? 22 : 20}
									color={met ? colors.primary : colors.muted}
								/>
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: spacing.lg,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 28,
		color: colors.text,
		marginBottom: spacing.lg,
	},
	card: {
		backgroundColor: colors.card,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#E0EEF5",
		overflow: "hidden",
		marginBottom: spacing.lg,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
	},
	rowText: {
		flex: 1,
	},
	date: {
		fontFamily: fonts.bold,
		fontSize: 16,
		color: colors.text,
	},
	detail: {
		fontFamily: fonts.regular,
		fontSize: 14,
		color: colors.muted,
		marginTop: 2,
	},
	separator: {
		height: 1,
		backgroundColor: "#E0EEF5",
	},
	list: {
		flexGrow: 1,
	},
	empty: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontFamily: fonts.regular,
		fontSize: 16,
		color: colors.muted,
	},
});
