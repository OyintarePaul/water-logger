import Storage from "expo-sqlite/kv-store";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getLast7DayKeys } from "@/lib/dates";
import { colors, fonts, spacing } from "@/lib/theme";
import { readLog } from "@/lib/water-storage";

type WaterLog = Record<string, number>;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type BarItem = {
	value: number;
	label: string;
	rawValue: number;
	frontColor: string;
	topLabelComponent?: () => React.ReactNode;
};

type Props = {
	todayCount: number;
	goal: number;
};

export default function WeeklyChart({ todayCount, goal }: Props) {
	const { width: screenWidth } = useWindowDimensions();
	const [barData, setBarData] = useState<BarItem[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const chartWidth = screenWidth - spacing.lg * 4;

	useEffect(() => {
		async function loadChart() {
			const keys = getLast7DayKeys();
			let log = await readLog();

			const data = keys.map((key, i) => {
				const date = new Date(key + "T00:00:00");
				const label = DAY_LABELS[date.getDay()];
				const isToday = i === keys.length - 1;
				const rawValue = isToday ? todayCount : (log[key] ?? 0);
				const value = Math.min(rawValue, goal);
				return { value, label, rawValue, frontColor: colors.primary };
			});

			setBarData(
				data.map((item, i) => ({
					...item,
					topLabelComponent:
						selectedIndex === i
							? () => (
									<View style={styles.tooltip}>
										<Text style={styles.tooltipText}>{item.rawValue}</Text>
									</View>
								)
							: undefined,
				})),
			);
		}

		loadChart();
	}, [todayCount, goal, selectedIndex]);

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
