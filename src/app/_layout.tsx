import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ActivityIndicator, Text, View } from 'react-native';
import { db } from '@/db/client';
import migrations from '@/drizzle/migrations';
import { NavigationThemeProvider } from '@/components/navigation-theme-provider';

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations);

    if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text>Database error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }
	return (
		<NavigationThemeProvider>
			<Stack>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false
                }}/>
            </Stack>
			<PortalHost />
		</NavigationThemeProvider>
	);
}

