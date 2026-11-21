import Ionicons from "@react-native-vector-icons/ionicons";
import { ScrollView, View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { WeekBarChart } from "@/components/weekly-bar-chart";
import { DAILY_GOAL_ML } from "@/db/constants";
import { useHistory } from "@/db/queries/history";
import { useSettings } from "@/db/queries/settings";
import { formatTime } from "@/db/queries/water";

function dayLabel(date: Date) {
	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	if (date.toDateString() === now.toDateString()) return "Today";
	if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
	return date.toLocaleDateString([], { weekday: "long" });
}

function dayDate(date: Date) {
	return date.toLocaleDateString([], {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
}

export default function History() {
	const settings = useSettings();
	const { days, week, average, streak } = useHistory(settings.dailyGoalMl);
	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="gap-6 p-4"
            showsVerticalScrollIndicator={false}
		>
			<Card>
				<CardContent className="gap-4">
					<View className="flex-row items-start justify-between">
						<View>
							<Text className="text-lg font-semibold">This week</Text>
							<Text className="text-sm text-muted-foreground">
								6-day average {average.toLocaleString()} ml
							</Text>
						</View>
						<View className="rounded-full bg-secondary px-3 py-1">
                          <Text className="text-xs font-medium text-secondary-foreground">
                            {streak > 0 ? `${streak} day streak` : 'No streak yet'}
                          </Text>
                        </View>
					</View>

					<WeekBarChart days={week} goalMl={settings.dailyGoalMl} />

					{/*<Text className="text-xs text-muted-foreground">
						Dashed line marks the {settings.dailyGoalMl.toLocaleString()} ml goal.
					</Text>*/}
				</CardContent>
			</Card>

			{days.length === 0 && (
				<Text className="text-center text-muted-foreground">
					No water logged yet.
				</Text>
			)}

			{days.map((day) => (
				<View key={day.key} className="gap-2">
					<View className="flex-row items-end justify-between">
						<View>
							<Text className="font-semibold">{dayLabel(day.date)}</Text>
							<Text className="text-sm text-muted-foreground">
								{dayDate(day.date)}
							</Text>
						</View>
						<Text className="font-semibold text-primary">
							{day.totalMl.toLocaleString()} ml
						</Text>
					</View>

					<Card className="py-0">
						<CardContent className="p-0">
							{day.entries.map((entry, i) => (
								<View
									key={entry.id}
									className={`flex-row items-center gap-3 px-4 py-3 ${
										i < day.entries.length - 1 ? "border-b border-border" : ""
									}`}
								>
									<View className="size-9 items-center justify-center rounded-full bg-secondary">
										<Ionicons name="water" size={18} color="#1A8FD6" />
									</View>
									<View className="flex-1">
										<Text className="font-medium">{entry.label}</Text>
										<Text className="text-sm text-muted-foreground">
											{formatTime(entry.loggedAt)}
										</Text>
									</View>
									<Text className="font-medium">{entry.amountMl} ml</Text>
								</View>
							))}
						</CardContent>
					</Card>
				</View>
			))}
		</ScrollView>
	);
}
