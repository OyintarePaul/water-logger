import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Host, Switch } from '@expo/ui/jetpack-compose';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { getSettings, saveSettings, Settings } from '@/lib/settings-storage';
import { cancelReminder, requestReminderPermission, scheduleReminder } from '@/lib/notifications';
import { colors, fonts, spacing } from '@/lib/theme';

const MIN_GOAL = 1;
const MAX_GOAL = 50;

function formatTime(hour: number, minute: number): string {
  const d = new Date(2000, 0, 1, hour, minute);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function timeToDate(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [draft, setDraft] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(true);

  // Reload each time the tab is opened
  useFocusEffect(
    useCallback(() => {
      getSettings().then(s => {
        setSettings(s);
        setDraft(String(s.dailyGoal));
      });
    }, [])
  );

  // Always read the latest saved settings first, so one field's save can't overwrite another
  async function update(patch: Partial<Settings>): Promise<Settings> {
    const current = await getSettings();
    const next = { ...current, ...patch };
    await saveSettings(next);
    setSettings(next);
    return next;
  }

  async function commitGoal() {
    if (!settings) return;
    const parsed = parseInt(draft, 10);
    const valid = !Number.isNaN(parsed) && parsed >= MIN_GOAL && parsed <= MAX_GOAL;
    if (!valid) {
      setDraft(String(settings.dailyGoal));
      return;
    }
    await update({ dailyGoal: parsed });
    setDraft(String(parsed));
  }

  async function handleToggleReminder(enabled: boolean) {
    if (!settings) return;

    if (enabled) {
      const granted = await requestReminderPermission();
      if (!granted) {
        setPermissionDenied(true);
        return; // stays off
      }
      setPermissionDenied(false);
      const next = await update({ reminderEnabled: true });
      await scheduleReminder(next.reminderHour, next.reminderMinute);
    } else {
      setPermissionDenied(false);
      await cancelReminder();
      await update({ reminderEnabled: false });
    }
  }

  async function handleTimeSet(date: Date) {
    setShowTimePicker(false);
    const next = await update({
      reminderHour: date.getHours(),
      reminderMinute: date.getMinutes(),
    });
    if (next.reminderEnabled) {
      await scheduleReminder(next.reminderHour, next.reminderMinute);
    }
  }

  if (settings === null) {
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

      <Text style={styles.sectionLabel}>Reminders</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Daily reminder</Text>
          <Host matchContents>
            <Switch
              value={settings.reminderEnabled}
              onCheckedChange={handleToggleReminder}
              colors={{
                checkedTrackColor: colors.primary,
                checkedThumbColor: '#FFFFFF',
                uncheckedTrackColor: '#E0EEF5',
                uncheckedBorderColor: '#E0EEF5',
                uncheckedThumbColor: colors.muted,
              }}
            />
          </Host>
        </View>

        {settings.reminderEnabled && (
          <Pressable
            onPress={() => setShowTimePicker(true)}
            style={({ pressed }) => [styles.timeRow, { opacity: pressed ? 0.7 : 1 }]}>
            <Text style={styles.rowLabel}>Remind me at</Text>
            <Text style={styles.timeText}>
              {formatTime(settings.reminderHour, settings.reminderMinute)}
            </Text>
          </Pressable>
        )}

        {showTimePicker && (
          <DateTimePicker
            mode="time"
            value={timeToDate(settings.reminderHour, settings.reminderMinute)}
            is24Hour={false}
            accentColor={colors.primary}
            onValueChange={(_event, date) => handleTimeSet(date)}
            onDismiss={() => setShowTimePicker(false)}
          />
        )}

        {permissionDenied && (
          <Text style={styles.warning}>
            Notifications are blocked. Enable them in your phone's settings.
          </Text>
        )}
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  timeText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  warning: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.md,
  },
});