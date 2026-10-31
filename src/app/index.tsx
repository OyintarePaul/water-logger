import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProgressRing from '@/components/progress-ring';
import WeeklyChart from '@/components/weekly-chart';
import { getTodayKey } from '@/lib/dates';
import { colors, fonts, spacing } from '@/lib/theme';
import { DEFAULTS, getSettings } from '@/lib/settings-storage';
import { addGlass, getCount, undoGlass } from '@/lib/water-storage';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';

const RING_STROKE = 14;
const RING_MAX_RADIUS = 90;
const CARD_PADDING = spacing.lg;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [count, setCount] = useState<number | null>(null);
  const [goal, setGoal] = useState(DEFAULTS.dailyGoal);
  const scale = useSharedValue(1);

  // Fit the ring inside the card: screen minus page padding, card padding and border
  const availableWidth = screenWidth - spacing.lg * 2 - CARD_PADDING * 2 - 2;
  const radius = Math.min(RING_MAX_RADIUS, Math.floor((availableWidth - RING_STROKE) / 2));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    getCount(getTodayKey()).then(setCount);
  }, []);

  // Reload the goal each time the tab is opened, so changes in Settings apply here
  useFocusEffect(
    useCallback(() => {
      getSettings().then(s => setGoal(s.dailyGoal));
    }, [])
  );

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
        <ProgressRing count={count} goal={goal} radius={radius} strokeWidth={RING_STROKE}>
          <Animated.Text style={[styles.count, animatedStyle]}>{count}</Animated.Text>
          <Text style={styles.goal}>/ {goal} glasses</Text>
        </ProgressRing>
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
      <WeeklyChart todayCount={count} goal={goal} />
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
    padding: CARD_PADDING,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E0EEF5',
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: 64,
    lineHeight: 72,
    color: colors.primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  goal: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
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