import { Tabs } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useResolveClassNames } from "uniwind";

export default function TabLayout() {
  const tabBarStyle = useResolveClassNames(
    'bg-surface border-t border-primary-light pb-2 pt-2 h-[60px]'
  );
  const activeTint = useResolveClassNames('text-primary');
  const inactiveTint = useResolveClassNames('text-text-muted');
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabBarStyle,
        tabBarActiveTintColor: activeTint.color as string,
        tabBarInactiveTintColor: inactiveTint.color as string,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hydrate',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="water-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}