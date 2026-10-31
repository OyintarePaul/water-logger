import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/lib/theme';

// Placeholder — replaced by the History screen (feature 5).
export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.muted,
  },
});