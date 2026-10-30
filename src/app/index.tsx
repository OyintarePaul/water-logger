import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WeeklyChart from '@/components/weekly-chart';
import { getTodayKey } from '@/lib/dates';
import { colors, DAILY_GOAL, fonts, spacing } from '@/lib/theme';
import { addGlass, getCount, undoGlass } from '@/lib/water-storage';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState<number | null>(null);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    getCount(getTodayKey()).then(setCount);
  }, []);

  async function handleAdd() {
    const next = await addGlass(getTodayKey());
    setCount(next);
    scale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 150 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }

  async function handleUndo() {
    const next = await undoGlass(getTodayKey());
    setCount(next);
  }

  if (count === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <MaterialDesignIcons name="water" size={28} color={colors.primary} />
        <Text style={styles.title}>Water</Text>
      </View>

      <View style={styles.card}>
        <Animated.Text style={[styles.count, animatedStyle]}>{count}</Animated.Text>
        <Text style={styles.goal}>/ {DAILY_GOAL} glasses</Text>
      </View>

      <Pressable
        onPress={handleAdd}
        style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : 1 }]}>
        <MaterialDesignIcons name="water-plus" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add glass</Text>
      </Pressable>

      <Pressable
        onPress={handleUndo}
        style={({ pressed }) => [styles.undoButton, { opacity: pressed ? 0.7 : 1 }]}>
        <MaterialDesignIcons name="undo-variant" size={18} color={colors.muted} />
        <Text style={styles.undoButtonText}>Undo</Text>
      </Pressable>

      <WeeklyChart todayCount={count} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E0EEF5',
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: 80,
    color: colors.primary,
    lineHeight: 90,
  },
  goal: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.muted,
    marginTop: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addButtonText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  undoButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  undoButtonText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.muted,
  },
});