import { View } from "react-native";
import { DailyGoalCard } from "@/components/settings/daily-goal-card";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/db/queries/settings";

export function GoalPage() {
	const settings = useSettings();

	return (
		<View className="gap-6">
			<View className="gap-2">
				<Text className="text-center text-3xl font-bold">Set your goal</Text>
				<Text variant="muted" className="text-center">
					You can change this anytime in Settings.
				</Text>
			</View>
			<DailyGoalCard goalMl={settings.dailyGoalMl} />
		</View>
	);
}
