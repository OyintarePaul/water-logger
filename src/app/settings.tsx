import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSettings, saveSettings } from '@/lib/settings-storage';
import { colors, fonts, spacing } from '@/lib/theme';

const MIN_GOAL = 1;
const MAX_GOAL = 50;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  // Reload each time the tab is opened, so the value is fresh
  useFocusEffect(
    useCallback(() => {
      getSettings().then(s => {
        setGoal(s.dailyGoal);
        setDraft(String(s.dailyGoal));
      });
    }, [])
  );

  async function commitGoal() {
    const parsed = parseInt(draft, 10);
    const valid = !Number.isNaN(parsed) && parsed >= MIN_GOAL && parsed <= MAX_GOAL;

    if (!valid || goal === null) {
      // Invalid input: restore the last saved value
      setDraft(String(goal ?? ''));
      return;
    }

    const current = await getSettings();
    await saveSettings({ ...current, dailyGoal: parsed });
    setGoal(parsed);
    setDraft(String(parsed));
  }

  if (goal === null) {
    return <View style={styles.loading} />;
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionLabel}>Goal</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Glasses per day</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={commitGoal}
            onSubmitEditing={commitGoal}
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="done"
            style={styles.input}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E0EEF5',
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  input: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
    minWidth: 56,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E0EEF5',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});