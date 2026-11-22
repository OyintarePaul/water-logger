import Ionicons from "@react-native-vector-icons/ionicons";
import { Tabs, useTheme } from "expo-router";
import { View } from "react-native";
import { HeaderTitle } from "@/components/header-title";
import { Text } from "@/components/ui/text";

const icons = {
	index: { active: "home", inactive: "home-outline" },
	history: { active: "time", inactive: "time-outline" },
	settings: { active: "settings", inactive: "settings-outline" },
} as const;

export default function TabsLayout() {
	const { colors } = useTheme();
	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerTitleAlign: "left",
				headerShadowVisible: false,
				headerStyle: { backgroundColor: colors.background },
				tabBarLabelStyle: { marginTop: -4 },
				tabBarIcon: ({ focused, color }) => {
					const icon = icons[route.name as keyof typeof icons];
					return (
						<Ionicons
							name={focused ? icon.active : icon.inactive}
							size={18}
							color={color}
						/>
					);
				},
			})}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					headerTitle: () => (
						<HeaderTitle subtitle="Good morning" title="Today" />
					),
					headerRight: () => (
						<View className="mr-4 rounded-full bg-secondary px-4 py-2">
							<Text className="text-xs font-medium text-secondary-foreground">
								{new Date().toLocaleDateString([], {
									weekday: "short",
									month: "short",
									day: "numeric",
								})}
							</Text>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "History",
					headerTitle: () => (
						<HeaderTitle
							subtitle="Your logs, newest first"
							title="History"
							subtitlePosition="bottom"
						/>
					),
				}}
			/>
			<Tabs.Screen name="settings" options={{ title: "Settings" }} />
		</Tabs>
	);
}
