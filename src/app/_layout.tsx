import '@/global.css';
import { Stack, useRouter, useSegments, Link } from 'expo-router';
import { Pressable } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq } from "drizzle-orm"
import { db, runDatabaseMigrations } from '@/db/client';
import { userSettings } from '@/db/schema';
import { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      await runDatabaseMigrations();
      
      // Ensure default settings singleton row exists after migration
      const existingSettings = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.id, 1))
        .execute();

      if (existingSettings.length === 0) {
        await db.insert(userSettings).values({
          id: 1,
          dailyGoalMl: 3000,
          onboardingCompleted: 0,
          remindersEnabled: 1,
          reminderIntervalMins: 120,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00',
        });
      }

      setIsDbReady(true);
    }
    setup();
  }, []);

  // Fetch settings live from SQLite
  const { data: settingsList, error } = useLiveQuery(
    db.select().from(userSettings).where(eq(userSettings.id, 1)) // or standard eq
  );

  console.log(settingsList?.[0])

  // Fallback query if live query array is empty
  const settings = settingsList?.[0];
  const isOnboarded = settings?.onboardingCompleted === 1;
  console.log(isOnboarded)

  useEffect(() => {
    if (isDbReady && settings && !isOnboarded) {
      router.replace('/onboarding');
    }
  }, [isOnboarded, settings]);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#F4F7FB' },
          headerTintColor: '#1E293B',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'WaterLogger',
            headerTitle: 'WaterLogger',
            headerRight: () => (
              <Link asChild href="/settings">
                <Pressable
                  className="mr-2 p-1"
                >
                  <Ionicons name="settings-outline" size={24} color="#1E293B" />
                </Pressable>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            title: 'Settings',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}