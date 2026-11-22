import { Alert, ScrollView, View } from "react-native";
import { DailyGoalCard } from "@/components/settings/daily-goal-card";
import { RemindersCard } from "@/components/settings/reminders-card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/db/queries/settings";
import { clearAllEntries } from "@/db/queries/water";
import { resetOnboarding } from "@/db/queries/settings";

export default function SettingsScreen() {
	const settings = useSettings();

	function handleClear() {
		Alert.alert(
			"Clear all logs?",
			"This removes every water entry and cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Clear", style: "destructive", onPress: clearAllEntries },
			],
		);
	}

	return (
		<ScrollView className="flex-1" contentContainerClassName="gap-4 p-4 flex-1">
			<DailyGoalCard goalMl={settings.dailyGoalMl} />
			<RemindersCard settings={settings} />

			<View className="flex-1" />

            {/* Temporary test tools, remove before release */}
            <Button variant="outline" onPress={resetOnboarding}>
                <Text>Reset onboarding</Text>
            </Button>

			<Button variant="destructive" onPress={handleClear}>
				<Text>Clear all logs</Text>
			</Button>

			{/*<Button variant="outline" onPress={seedWaterEntries}>
				<Text>Seed test data</Text>
			</Button>

			<Button variant="outline" onPress={debugTestNotification}>
				<Text>Test notification</Text>
			</Button>*/}
		</ScrollView>
	);
}
