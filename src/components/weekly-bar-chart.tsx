import { useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import type { WeekDay } from "@/db/queries/history";

const MET_COLOR = "#1A8FD6";
const NOT_MET_COLOR = "#B3DCF2";
const LABEL_COLOR = "#4F6475";
const GOAL_LINE_COLOR = "#9DB3C4";

type WeekBarChartProps = {
	days: WeekDay[];
	goalMl: number;
};

export function WeekBarChart({ days, goalMl }: WeekBarChartProps) {
	const { width } = useWindowDimensions();
	// Approximate card inner width: screen padding plus card padding
	const chartWidth = width - 112;
	const barWidth = 22;
	const spacing = Math.floor((chartWidth - 7 * barWidth) / 7);

	const data = days.map((day) => ({
		value: day.totalMl,
		label: day.date
			.toLocaleDateString([], { weekday: "short" })
			.charAt(0)
			.toUpperCase(),
		frontColor: day.goalMet ? MET_COLOR : NOT_MET_COLOR,
		labelTextStyle: {
			color: LABEL_COLOR,
			fontSize: 12,
			fontWeight: "600" as const,
		},
	}));

	const highest = Math.max(goalMl, ...days.map((d) => d.totalMl));

	return (
		<BarChart
			key={`${goalMl}-${days.map((d) => d.totalMl).join("-")}`}
			data={data}
			width={chartWidth}
			height={160}
			barWidth={barWidth}
			spacing={spacing}
			initialSpacing={spacing / 2}
			barBorderRadius={6}
			maxValue={highest * 1.15}
			noOfSections={4}
			yAxisThickness={0}
			xAxisThickness={0}
			hideYAxisText
			hideRules
			showReferenceLine1
			referenceLine1Position={goalMl}
			referenceLine1Config={{
				color: GOAL_LINE_COLOR,
				thickness: 1,
				dashWidth: 6,
				dashGap: 4,
			}}
			disableScroll
		/>
	);
}
