import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { QuickLogs } from "@/components/quick-logs";
import { logWater } from "@/db/water"
import { WaterProgressCard } from '@/components/water-progress-card';
import { WeekStreak, type DayStatus } from '@/components/week-streak';

const testGoalMet = [true, false, true, true, false, true, false];

const testWeek: DayStatus[] = testGoalMet.map((goalMet, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return { date, goalMet };
});

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4">
        <WaterProgressCard
            consumedMl={1200}
            goalMl={2000}
            lastLabel="Small Cup"
            lastTime="9:40 AM"
        />

        <WeekStreak days={testWeek} />

      <QuickLogs
        onPresetPress={(preset) => logWater({ label: preset.label, amountMl: preset.amountMl })}
      />
    </ScrollView>
  );
}
