import { View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
      <Button
        variant="secondary"
        size="icon"
        disabled={!canDecrement}
        onPress={onDecrement}
        className="rounded-full size-9"
      >
        <Text className="text-base">−</Text>
      </Button>

      {children && <View className="min-w-16 items-center">{children}</View>}

      <Button
        size="icon"
        disabled={!canIncrement}
        onPress={onIncrement}
        className="rounded-full size-9"
      >
        <Text className="text-base">+</Text>
      </Button>
    </View>
  );
}
