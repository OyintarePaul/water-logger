import { Pressable, Switch, View } from 'react-native';
import { useCSSVariable } from 'uniwind';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import {
  HOUR_MAX,
  HOUR_MIN,
  REMINDER_INTERVALS_MIN,
} from '@/db/constants';
import { type Settings, updateSettings } from '@/db/queries/settings';
import { Stepper } from './stepper';

type RemindersCardProps = {
  settings: Settings;
};

function formatInterval(minutes: number) {
  return minutes < 60 ? `${minutes}m` : `${minutes / 60}h`;
}

function formatHour(hour: number) {
  return new Date(2000, 0, 1, hour).toLocaleTimeString([], { hour: 'numeric' });
}

export function RemindersCard({ settings }: RemindersCardProps) {
  const primary = useCSSVariable('--color-primary');
  const track = useCSSVariable('--color-border-strong');
  const thumb = useCSSVariable('--color-foreground');

  const { remindersEnabled, reminderIntervalMin, reminderStartHour, reminderEndHour } = settings;

  return (
    <Card>
      <CardContent className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-semibold">Reminders</Text>
            <Text variant="muted" className="text-muted-foreground">
              Notify me to drink water
            </Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={(value) => updateSettings({ remindersEnabled: value })}
            trackColor={{ false: track, true: primary }}
            thumbColor={thumb}
          />
        </View>

        <View className={`gap-4 ${remindersEnabled ? '' : 'opacity-40'}`}>
          <View className="h-px bg-border" />

          <View className="gap-2">
            <Text className="text-sm font-medium">Remind me every</Text>
            <View className="flex-row gap-2">
              {REMINDER_INTERVALS_MIN.map((minutes) => {
                const selected = reminderIntervalMin === minutes;
                return (
                  <Pressable
                    key={minutes}
                    disabled={!remindersEnabled}
                    onPress={() => updateSettings({ reminderIntervalMin: minutes })}
                    className={`flex-1 items-center rounded-full border py-2 ${
                      selected ? 'border-primary bg-secondary' : 'border-border'
                    }`}
                  >
                    <Text className={selected ? 'font-semibold text-primary' : ''}>
                      {formatInterval(minutes)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium">From</Text>
            <Stepper
              canDecrement={remindersEnabled && reminderStartHour > HOUR_MIN}
              canIncrement={remindersEnabled && reminderStartHour < reminderEndHour - 1}
              onDecrement={() => updateSettings({ reminderStartHour: reminderStartHour - 1 })}
              onIncrement={() => updateSettings({ reminderStartHour: reminderStartHour + 1 })}
            >
              <Text className="text-sm font-semibold">{formatHour(reminderStartHour)}</Text>
            </Stepper>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium">Until</Text>
            <Stepper
              canDecrement={remindersEnabled && reminderEndHour > reminderStartHour + 1}
              canIncrement={remindersEnabled && reminderEndHour < HOUR_MAX}
              onDecrement={() => updateSettings({ reminderEndHour: reminderEndHour - 1 })}
              onIncrement={() => updateSettings({ reminderEndHour: reminderEndHour + 1 })}
            >
              <Text className="text-sm font-semibold">{formatHour(reminderEndHour)}</Text>
            </Stepper>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
