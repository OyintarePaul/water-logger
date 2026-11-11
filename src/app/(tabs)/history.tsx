import { View, Text } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-canvas p-6 justify-center items-center">
      <View className="bg-surface rounded-3xl p-6 w-full max-w-md shadow-sm">
        <Text className="text-xl font-bold text-text-main mb-4">7-Day History</Text>
        <View className="h-48 bg-primary-light rounded-2xl justify-center items-center">
          <Text className="text-text-muted font-medium">Chart placeholder (Gifted Charts)</Text>
        </View>
      </View>
    </View>
  );
}