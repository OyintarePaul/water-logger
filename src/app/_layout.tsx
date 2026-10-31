import { Tabs } from 'expo-router';
import { Nunito_400Regular, Nunito_700Bold, useFonts } from '@expo-google-fonts/nunito';
import { StatusBar } from 'expo-status-bar';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

type IconName = ComponentProps<typeof MaterialDesignIcons>['name'];

// Icon for each tab: [active, inactive]. History and Settings use the same
// glyph in both states; only the colour changes.
const TAB_ICONS: Record<string, [IconName, IconName]> = {
  index: ['water', 'water-outline'],
  history: ['history', 'history'],
  settings: ['tune-variant', 'tune-variant'],
};

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_700Bold });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            { height: 60 + insets.bottom, paddingBottom: insets.bottom },
          ],
          tabBarItemStyle: styles.tabItem,
          tabBarIcon: ({ focused }) => {
            const [active, inactive] = TAB_ICONS[route.name] ?? ['water', 'water-outline'];
            return (
                <MaterialDesignIcons
                  name={focused ? active : inactive}
                  size={24}
                  color={focused ? colors.primary : colors.muted}
                />
            );
          },
        })}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: '#E0EEF5',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
});