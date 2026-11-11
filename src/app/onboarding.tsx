import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import { db } from '@/db/client';
import { userSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Stay Hydrated in the Heat',
    subtitle: 'Effortless, offline water tracking tailored for the warm Nigerian climate. Keep your energy high and stay consistent every day.',
    icon: 'sunny-outline',
  },
  {
    id: '2',
    title: 'Set Your Daily Target',
    subtitle: 'Choose your optimal daily hydration goal to keep your body balanced and energized.',
    icon: 'water-outline',
  },
  {
    id: '3',
    title: 'Never Forget a Sip',
    subtitle: 'Receive smart, offline notifications throughout the day to help you reach your goals effortlessly.',
    icon: 'notifications-outline',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(3000); // Default 3.0L

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleComplete = async (enableReminders: boolean) => {
    try {
      await db
        .update(userSettings)
        .set({
          dailyGoalMl: selectedGoal,
          remindersEnabled: enableReminders ? 1 : 0,
          onboardingCompleted: 1,
        })
        .where(eq(userSettings.id, 1))

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to save onboarding settings:', err);
    }
  };

  const renderItem = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    return (
      <View style={{ width }} className="flex-1 px-6 justify-center items-center bg-canvas">
        {/* Top Graphic & Text */}
        <View className="w-full items-center mb-6">
          <View className="w-32 h-32 rounded-full bg-primary-light items-center justify-center shadow-sm mb-8">
            <Ionicons name={item.icon as any} size={56} color="#0A93F6" />
          </View>
          <Text className="text-3xl font-extrabold text-text-main text-center mb-3">
            {item.title}
          </Text>
          <Text className="text-base text-text-muted text-center px-4 leading-6">
            {item.subtitle}
          </Text>
        </View>

        {/* Step 2 Interactive Goal Selector Card */}
        {index === 1 && (
          <View className="w-full bg-surface p-6 rounded-3xl items-center border border-slate-100 shadow-sm mt-4">
            <Text className="text-5xl font-extrabold text-primary mb-1">
              {(selectedGoal / 1000).toFixed(1)}L
            </Text>
            <Text className="text-sm font-medium text-text-muted mb-6">
              ~ {Math.round(selectedGoal / 250)} standard glasses (250ml)
            </Text>

            <View className="flex-row justify-between w-full gap-3">
              {[
                { label: '2.5L', ml: 2500 },
                { label: '3.0L', ml: 3000 },
                { label: '3.5L', ml: 3500 },
              ].map((opt) => {
                const isSelected = selectedGoal === opt.ml;
                return (
                  <TouchableOpacity
                    key={opt.ml}
                    onPress={() => setSelectedGoal(opt.ml)}
                    className={`flex-1 py-3 rounded-2xl items-center border ${
                      isSelected
                        ? 'border-2 border-primary bg-primary-light/30'
                        : 'border-slate-200 bg-surface'
                    }`}
                  >
                    <Text className={`font-bold ${isSelected ? 'text-primary' : 'text-text-main'}`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-canvas pt-12">
      {/* Sleek Horizontal FlatList */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Bottom Sticky Footer with Dynamic Dots & Actions */}
      <View className="px-6 pb-10 bg-canvas pt-4">
        <View className="flex-row justify-center items-center mb-6">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`mx-1 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-slate-300'
              }`}
            />
          ))}
        </View>

        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity
            onPress={handleNext}
            className="w-full py-4 bg-primary rounded-2xl items-center justify-center shadow-md shadow-primary/20"
          >
            <Text className="text-base font-bold text-white">Continue</Text>
          </TouchableOpacity>
        ) : (
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => handleComplete(true)}
              className="w-full py-4 bg-primary rounded-2xl items-center justify-center shadow-md shadow-primary/20"
            >
              <Text className="text-base font-bold text-white">Enable Reminders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleComplete(false)}
              className="py-2 items-center"
            >
              <Text className="text-sm font-semibold text-text-muted">Skip for Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}