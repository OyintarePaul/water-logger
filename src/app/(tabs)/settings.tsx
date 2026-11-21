import { Alert, ScrollView } from 'react-native';
import { DailyGoalCard } from '@/components/settings/daily-goal-card';
import { RemindersCard } from '@/components/settings/reminders-card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { seedWaterEntries } from '@/db/seed';
import { clearAllEntries } from '@/db/queries/water';
import { useSettings } from '@/db/queries/settings';

export default function SettingsScreen() {
  const settings = useSettings();

  function handleClear() {
    Alert.alert('Clear all logs?', 'This removes every water entry and cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearAllEntries },
    ]);
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
      <DailyGoalCard goalMl={settings.dailyGoalMl} />
      <RemindersCard settings={settings} />

      {/* Temporary test tools, remove before release */}
      <Button variant="destructive" onPress={handleClear}>
        <Text>Clear all logs</Text>
      </Button>
      <Button variant="outline" onPress={seedWaterEntries}>
        <Text>Seed test data</Text>
      </Button>
    </ScrollView>
  );
}
