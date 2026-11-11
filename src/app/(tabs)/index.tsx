import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HydrateScreen() {
  return (
    <View className="flex-1 bg-canvas p-6 justify-center items-center">
      <View className="bg-surface rounded-3xl p-6 w-full max-w-md shadow-sm items-center">
        <Text className="text-base font-medium text-text-muted mb-2">Today's Intake</Text>
        <Text className="text-7xl font-extrabold text-primary mb-6">
          1,250<Text className="text-2xl text-text-muted">ml</Text>
        </Text>
        
        <View className="flex-row gap-4 w-full">
          <TouchableOpacity className="flex-1 bg-primary py-4 rounded-2xl items-center shadow-sm">
            <Text className="text-base font-semibold text-white">Add Glass</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-primary-light py-4 rounded-2xl items-center">
            <Text className="text-base font-semibold text-primary">Undo</Text>
          </TouchableOpacity>
        </View>

        <View className='mt-4'>
          <Link asChild href="/onboarding">
            <TouchableOpacity className='bg-primary rounded-2xl items-center py-4 px-6'><Text className="text-base font-semibold text-white">Go to onboarding</Text></TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}