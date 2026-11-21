import { View } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { GLASS_SIZE_ML, GOAL_MAX_ML, GOAL_MIN_ML, GOAL_STEP_ML } from '@/db/constants';
import { updateSettings } from '@/db/queries/settings';
import { Stepper } from './stepper';

type DailyGoalCardProps = {
  goalMl: number;
};

export function DailyGoalCard({ goalMl }: DailyGoalCardProps) {
  const glasses = Math.round(goalMl / GLASS_SIZE_ML);

  function changeGoal(delta: number) {
    const next = Math.min(Math.max(goalMl + delta, GOAL_MIN_ML), GOAL_MAX_ML);
    updateSettings({ dailyGoalMl: next });
  }

  return (
    <Card>
      <CardContent className="gap-2">
        <Text variant="muted" className="text-xs font-semibold uppercase">
          Daily goal
        </Text>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-4xl font-bold">
              {goalMl.toLocaleString()} <Text className="text-lg">ml</Text>
            </Text>
            <Text variant="muted" className="text-sm">
              About {glasses} glasses a day
            </Text>
            <Text variant="muted" className="text-sm">
              Steps of {GOAL_STEP_ML} ml
            </Text>
          </View>

          <Stepper
            canDecrement={goalMl > GOAL_MIN_ML}
            canIncrement={goalMl < GOAL_MAX_ML}
            onDecrement={() => changeGoal(-GOAL_STEP_ML)}
            onIncrement={() => changeGoal(GOAL_STEP_ML)}
          />
        </View>
      </CardContent>
    </Card>
  );
}
