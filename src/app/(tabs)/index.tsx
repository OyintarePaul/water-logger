import { ScrollView } from "react-native";
import { QuickLogs } from "@/components/quick-logs";
import { Text } from "@/components/ui/text";
import { WaterProgressCard } from "@/components/water-progress-card";
import { type DayStatus, WeekStreak } from "@/components/week-streak";
import { DAILY_GOAL_ML } from "@/db/constants";
import { logWater, useTodaySummary } from "@/db/queries/water";

const testGoalMet = [true, false, true, true, false, true, false];

const testWeek: DayStatus[] = testGoalMet.map((goalMet, i) => {
	const date = new Date();
	date.setDate(date.getDate() - (6 - i));
	return { date, goalMet };
});

export default function HomeScreen() {
	const { consumedMl, lastLabel, lastTime } = useTodaySummary();
	return (
		<ScrollView className="flex-1" contentContainerClassName="gap-4">
			<WaterProgressCard
				consumedMl={consumedMl}
				goalMl={DAILY_GOAL_ML}
				lastLabel={lastLabel}
				lastTime={lastTime}
			/>
			<WeekStreak days={testWeek} />
			<QuickLogs
				onPresetPress={(preset) =>
					logWater({ label: preset.label, amountMl: preset.amountMl })
				}
			/>
		</ScrollView>
	);
}
