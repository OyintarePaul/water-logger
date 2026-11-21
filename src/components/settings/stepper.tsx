import { Pressable, View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { Text } from '../ui/text';

type StepperProps = PropsWithChildren<{
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement?: boolean;
  canIncrement?: boolean;
}>;

export function Stepper({
  onDecrement,
  onIncrement,
  canDecrement = true,
  canIncrement = true,
  children,
}: StepperProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        disabled={!canDecrement}
        onPress={onDecrement}
        className="size-9 items-center justify-center rounded-full bg-secondary active:opacity-70 disabled:opacity-40"
      >
        <Text className="text-lg font-semibold text-secondary-foreground">−</Text>
      </Pressable>

      {children && <View className="min-w-16 items-center">{children}</View>}

      <Pressable
        disabled={!canIncrement}
        onPress={onIncrement}
        className="size-9 items-center justify-center rounded-full bg-primary active:opacity-70 disabled:opacity-40"
      >
        <Text className="text-lg font-semibold text-primary-foreground">+</Text>
      </Pressable>
    </View>
  );
}
