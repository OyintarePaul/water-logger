import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { QuickLogs } from "@/components/quick-logs";
import { StreakCard } from '@/components/streak-card';
import { UndoToast } from "@/components/undo-toast";
import { WaterProgressCard } from "@/components/water-progress-card";
import { type DayStatus, WeekStreak } from "@/components/week-streak";
import type { PRESETS } from "@/db/constants";
import { useSettings } from "@/db/queries/settings";
import { useHistory } from '@/db/queries/history';
import { deleteEntry, logWater, useTodaySummary } from "@/db/queries/water";

type LastLog = { id: number; label: string; amountMl: number };

export default function HomeScreen() {
	const settings = useSettings();
    const { consumedMl, lastLabel, lastTime } = useTodaySummary();
    const { streak } = useHistory(settings.dailyGoalMl);
    const [lastLog, setLastLog] = useState<LastLog | null>(null);

	function handlePresetPress(preset: (typeof PRESETS)[number]) {
		const id = logWater({ label: preset.label, amountMl: preset.amountMl });
		setLastLog({ id, label: preset.label, amountMl: preset.amountMl });
	}

	return (
		<View className="flex-1">
			<ScrollView className="flex-1" contentContainerClassName="gap-4 p-4" showsVerticalScrollIndicator={false}>
				<WaterProgressCard
					consumedMl={consumedMl}
					goalMl={settings.dailyGoalMl}
					lastLabel={lastLabel}
					lastTime={lastTime}
				/>

                <StreakCard streak={streak} />

				<QuickLogs onPresetPress={handlePresetPress} />
			</ScrollView>
			{lastLog && (
				<UndoToast
					key={lastLog.id}
					label={lastLog.label}
					amountMl={lastLog.amountMl}
					onUndo={() => {
						deleteEntry(lastLog.id);
						setLastLog(null);
					}}
					onDismiss={() => setLastLog(null)}
				/>
			)}
		</View>
	);
}
