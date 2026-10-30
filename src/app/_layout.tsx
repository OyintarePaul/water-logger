import { Stack } from 'expo-router';
import { Nunito_400Regular, Nunito_700Bold, useFonts } from '@expo-google-fonts/nunito';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_700Bold });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}