import { View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Text } from '@/components/ui/text';

export function WelcomePage() {
  return (
    <View className="items-center gap-4">
      <Ionicons name="water" size={64} className="text-primary" />
      <Text className="text-center text-3xl font-bold">Welcome to Water Logger</Text>
      <Text variant="muted" className="text-center">
        Tap a preset to log a drink, and track your progress toward your daily goal.
      </Text>
    </View>
  );
}
