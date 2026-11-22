import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack, useTheme } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationThemeProvider } from "@/components/navigation-theme-provider";
import { db } from "@/db/client";
import { ensureSettings, useSettings } from "@/db/queries/settings";
import migrations from "@/drizzle/migrations";
import { useReminderSync } from "@/hooks/use-reminder-sync";

export default function RootLayout() {
	const { success, error } = useMigrations(db, migrations);
	const [seeded, setSeeded] = useState(false);

	useEffect(() => {
		if (success) {
			ensureSettings();
			setSeeded(true);
		}
	}, [success]);

	if (error) {
		return (
			<View className="flex-1 items-center justify-center p-6">
				<Text>Database error: {error.message}</Text>
			</View>
		);
	}

	if (!success || !seeded) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<NavigationThemeProvider>
			<AppStack />
			<PortalHost />
		</NavigationThemeProvider>
	);
}

function AppStack() {
	const { onboardingCompleted } = useSettings();
	const { colors } = useTheme();
	useReminderSync();

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: colors.background },
				animation: "fade",
			}}
		>
			<Stack.Protected guard={!onboardingCompleted}>
				<Stack.Screen name="onboarding" options={{ headerShown: false }} />
			</Stack.Protected>

			<Stack.Protected guard={onboardingCompleted}>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack.Protected>
		</Stack>
	);
}
