import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { RemindersCard } from '@/components/settings/reminders-card';
import { useSettings } from '@/db/queries/settings';

export function RemindersPage() {
  const settings = useSettings();

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-center text-3xl font-bold">Stay on track</Text>
        <Text variant="muted" className="text-center">
          Choose how often and when we remind you.
        </Text>
      </View>
      <RemindersCard settings={settings} />
    </View>
  );
}
