import { View } from 'react-native';
import { ProgressRing } from './progress-ring';
import { Card, CardContent } from './ui/card';
import { Text } from './ui/text';

type WaterProgressCardProps = {
  consumedMl: number;
  goalMl: number;
  lastLabel?: string;
  lastTime?: string;
};

export function WaterProgressCard({
  consumedMl,
  goalMl,
  lastLabel,
  lastTime,
}: WaterProgressCardProps) {
  const progress = goalMl > 0 ? consumedMl / goalMl : 0;
  const percent = Math.round(Math.min(progress, 1) * 100);

  return (
    <View className="px-4">
        <Card>
          <CardContent className="items-center gap-4 py-2">
            <ProgressRing progress={progress} size={180} strokeWidth={14}>
              <Text className="text-5xl font-bold">{percent}%</Text>
              <Text className="text-sm text-muted-foreground">
                {consumedMl} / {goalMl} ml
              </Text>
            </ProgressRing>

            <View>
              <Text className="text-sm text-muted-foreground">
                Last logged · {lastLabel ? `${lastLabel}, ${lastTime}` : 'Nothing yet'}
              </Text>
            </View>
          </CardContent>
        </Card>
    </View>
  );
}
