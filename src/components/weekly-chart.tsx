import { useMemo } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getLast7DayKeys } from "@/lib/dates";
import { colors, fonts, spacing } from "@/lib/theme";
import { getLogsByDates } from "@/db/queries"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
	goal: number;
};

export default function WeeklyChart({ goal }: Props) {
	const { width: screenWidth } = useWindowDimensions();
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const last7DayKeys = getLast7DayKeys()
	const { data: dbRows } = useLiveQuery(getLogsByDates(last7DayKeys))
	
	const chartWidth = screenWidth - spacing.lg * 4;

	const barData = useMemo(() => {
		const logMap: Record<string, number> = {};
		if (dbRows) {
			for (const row of dbRows) {
				logMap[row.log_date] = row.count;
			}
		}

		return last7DayKeys.map((key, i) => {
			const date = new Date(key + "T00:00:00");
			const label = DAY_LABELS[date.getDay()];
			
			const rawValue = logMap[key] ?? 0;
			const value = Math.min(rawValue, goal);

			return {
				value,
				label,
				frontColor: colors.primary,
				topLabelComponent:
					selectedIndex === i
						? () => (
								<View style={styles.tooltip}>
									<Text style={styles.tooltipText}>{rawValue}</Text>
								</View>
							)
						: undefined,
			};
		});
	}, [dbRows, last7DayKeys, goal, selectedIndex]);

	return (
		<View style={styles.card}>
			<Text style={styles.heading}>Last 7 days</Text>
			<BarChart
				data={barData}
				maxValue={goal}
				initialSpacing={0}
				yAxisLabelWidth={0}
				adjustToWidth
				parentWidth={chartWidth}
				roundedTop
				hideRules
				hideAxesAndRules
				noOfSections={1}
				barBorderRadius={6}
				backgroundColor={colors.card}
				width={chartWidth}
				disableScroll
				xAxisLabelTextStyle={styles.axisLabel}
				onPress={(_item: unknown, index: number) =>
					setSelectedIndex((prev) => (prev === index ? null : index))
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.card,
		borderRadius: 20,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: "#E0EEF5",
		marginTop: spacing.md,
	},
	heading: {
		fontFamily: fonts.bold,
		fontSize: 16,
		color: colors.text,
		marginBottom: spacing.md,
	},
	axisLabel: {
		fontFamily: fonts.regular,
		fontSize: 11,
		color: colors.muted,
	},
	tooltip: {
		backgroundColor: colors.primary,
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 2,
		marginBottom: 4,
	},
	tooltipText: {
		fontFamily: fonts.bold,
		fontSize: 11,
		color: "#fff",
	},
});
