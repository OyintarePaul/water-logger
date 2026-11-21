import { useState, useEffect } from 'react';
import { ScrollView, View } from "react-native";
import { QuickLogs } from "@/components/quick-logs";
import { Text } from "@/components/ui/text";
import { WaterProgressCard } from "@/components/water-progress-card";
import { type DayStatus, WeekStreak } from "@/components/week-streak";
import { logWater, useTodaySummary } from "@/db/queries/water";
import { UndoToast } from '@/components/undo-toast';
import { PRESETS } from "@/db/constants";
import { deleteEntry } from "@/db/queries/water";
import { useSettings } from '@/db/queries/settings';

type LastLog = { id: number; label: string; amountMl: number };

const testGoalMet = [true, false, true, true, false, true, false];

const testWeek: DayStatus[] = testGoalMet.map((goalMet, i) => {
	const date = new Date();
	date.setDate(date.getDate() - (6 - i));
	return { date, goalMet };
});

export default function HomeScreen() {
    const settings = useSettings();
	const { consumedMl, lastLabel, lastTime } = useTodaySummary();
    const [lastLog, setLastLog] = useState<LastLog | null>(null);

    function handlePresetPress(preset: (typeof PRESETS)[number]) {
        const id = logWater({ label: preset.label, amountMl: preset.amountMl });
        setLastLog({ id, label: preset.label, amountMl: preset.amountMl });
    }

	return (
        <View className="flex-1">
    		<ScrollView className="flex-1" contentContainerClassName="gap-4">
    			<WaterProgressCard
    				consumedMl={consumedMl}
    				goalMl={settings.dailyGoalMl}
    				lastLabel={lastLabel}
    				lastTime={lastTime}
    			/>
    			<WeekStreak days={testWeek} />

    			<QuickLogs
    				onPresetPress={handlePresetPress}
    			/>

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
