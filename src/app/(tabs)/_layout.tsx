import { Tabs } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';

const icons = {
  index: { active: 'home', inactive: 'home-outline' },
  history: { active: 'time', inactive: 'time-outline' },
  settings: { active: 'settings', inactive: 'settings-outline' },
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { marginTop: -4 },
        tabBarIcon: ({ focused, color, size }) => {
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
      <Tabs.Screen name="index" options={{
            title: 'Home'
        }}
        />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
