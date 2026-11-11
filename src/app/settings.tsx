import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useResolveClassNames } from "uniwind";
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db/client';
import { userSettings, intakeLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Host } from '@expo/ui';
import { Slider, Switch } from "@expo/ui/jetpack-compose";
import ResetOnboardingButton from '@/components/reset-onboarding-button';

export default function SettingsScreen() {
  const primaryStyle = useResolveClassNames('text-primary');
  const primaryLightStyle = useResolveClassNames('text-primary-light');

  // switch
  const primary = useResolveClassNames('text-primary');
  const surface = useResolveClassNames('text-surface');
  const canvas = useResolveClassNames('text-canvas');
  const textMuted = useResolveClassNames('text-text-muted');

  const { data: settingsList } = useLiveQuery(
    db.select().from(userSettings).where(eq(userSettings.id, 1))
  );
  const settings = settingsList?.[0] ?? {
    dailyGoalMl: 3000,
    remindersEnabled: 1,
    reminderIntervalMins: 120,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  };

  const updateGoal = async (newGoal: number) => {
    await db
      .update(userSettings)
      .set({ dailyGoalMl: newGoal })
      .where(eq(userSettings.id, 1))
      .execute();
  };

  const toggleReminders = async (value: boolean) => {
    await db
      .update(userSettings)
      .set({ remindersEnabled: value ? 1 : 0 })
      .where(eq(userSettings.id, 1))
      .execute();
  };

  const handleResetLogs = () => {
    Alert.alert(
      'Reset Water Logs',
      'Are you sure you want to clear your water intake logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Logs',
          style: 'destructive',
          onPress: async () => {
            await db.delete(intakeLogs)
            Alert.alert('Success', "Your logs have been reset.");
          },
        },
      ]
    );
  };
  return (
    <ScrollView className="flex-1 bg-canvas px-4 py-4">
      {/* HYDRATION GOAL SECTION */}
      <Text className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2 mt-2">
        Hydration Goal
      </Text>
      <View className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-medium text-text-main">Daily Target</Text>
          <Text className="text-base font-bold text-primary">
            {settings.dailyGoalMl.toLocaleString()} ml
          </Text>
        </View>
        <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
          <Slider
            min={1500}
            max={5000}
            steps={13}
            colors={{
              thumbColor: primaryStyle.color as string,
              activeTrackColor: primaryStyle.color as string,
              inactiveTrackColor: primaryLightStyle.color as string,
              activeTickColor: "transparent",
              inactiveTickColor: "transparent"
            }}
            value={settings.dailyGoalMl}
            onValueChange={(val: number) => updateGoal(Math.round(val))}

          />


        </Host>
      </View>

      {/* NOTIFICATIONS & REMINDERS SECTION */}
      <Text className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
        Notifications & Reminders
      </Text>
      <View className="bg-surface rounded-3xl p-4 border border-slate-100 shadow-sm mb-6">
        <View className="flex-row justify-between items-center pb-3 border-b border-slate-100">
          <View>
            <Text className="text-base font-medium text-text-main">Enable Reminders</Text>
            <Text className="text-xs text-text-muted">Local offline reminder notifications</Text>
          </View>
          <Host matchContents>
            <Switch
              value={settings.remindersEnabled === 1}
              onCheckedChange={toggleReminders}
              colors={{
                checkedTrackColor: primary.color as string,       // #0A93F6 (--color-primary)
                checkedThumbColor: surface.color as string,       // #FFFFFF (--color-surface)
                uncheckedTrackColor: canvas.color as string,      // #F4F7FB (--color-canvas)
                uncheckedThumbColor: textMuted.color as string,   // #64748B (--color-text-muted)
                uncheckedBorderColor: textMuted.color as string,  // #64748B (--color-text-muted)
              }}
            />
          </Host>
        </View>

        <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
          <Text className="text-base font-medium text-text-main">Reminder Interval</Text>
          <Text className="text-base text-text-muted">Every {settings.reminderIntervalMins / 60} hrs</Text>
        </View>

        <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
          <Text className="text-base font-medium text-text-main">Quiet Hours Start</Text>
          <Text className="text-base text-text-muted">{settings.quietHoursStart}</Text>
        </View>

        <View className="flex-row justify-between items-center py-3">
          <Text className="text-base font-medium text-text-main">Quiet Hours End</Text>
          <Text className="text-base text-text-muted">{settings.quietHoursEnd}</Text>
        </View>
      </View>

      {/* APP INFO & DATA MANAGEMENT SECTION */}
      <Text className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
        Data
      </Text>
      <View className="bg-surface rounded-3xl border border-slate-100 shadow-sm mb-8">
        <TouchableOpacity onPress={handleResetLogs} className="items-start p-4">
          <Text className="text-base font-medium text-red-600">Reset All Logs</Text>
        </TouchableOpacity>
      </View>

      <ResetOnboardingButton />
    </ScrollView>
  );
}