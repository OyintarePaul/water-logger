import { View } from 'react-native';
import { Text } from './ui/text';

export type DayStatus = {
  date: Date;
  goalMet: boolean;
};

type WeekStreakProps = {
  days: DayStatus[];
};

export function WeekStreak({ days }: WeekStreakProps) {
  const todayKey = new Date().toDateString();

  return (
    <View className="flex-row justify-between px-4">
      {days.map((day) => {
        const key = day.date.toDateString();
        const isToday = key === todayKey;
        const letter = day.date
          .toLocaleDateString([], { weekday: 'short' })
          .charAt(0)
          .toUpperCase();

        return (
          <View
            key={key}
            className={`size-11 items-center justify-center rounded-full border-2 ${
              isToday ? 'border-primary' : 'border-transparent'
            }`}
          >
            <View
              className={`size-9 items-center justify-center rounded-full ${
                day.goalMet ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  day.goalMet ? 'text-primary-foreground' : 'text-secondary-foreground'
                }`}
              >
                {letter}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
