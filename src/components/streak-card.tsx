import { View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

type StreakCardProps = {
  streak: number;
};

export function StreakCard({ streak }: StreakCardProps) {
  const active = streak > 0;

  return (
    <Card>
      <CardContent className="flex-row items-center gap-4">
        <View className="size-12 items-center justify-center rounded-full bg-secondary">
          <Ionicons name="flame" size={24} color="#1A8FD6" />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold">
            {active ? `${streak} day streak` : 'No streak yet'}
          </Text>
          <Text variant="muted" className="text-sm">
            {active
              ? 'Goal met on each of these days'
              : 'Hit your goal today to start one'}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
