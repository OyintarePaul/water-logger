import { Alert, View } from 'react-native';
import { clearAllEntries } from '../../db/queries/water';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

export default function Settings() {
  function handleClear() {
    Alert.alert('Clear all logs?', 'This removes every water entry and cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearAllEntries },
    ]);
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-4">
      <Button variant="destructive" onPress={handleClear}>
        <Text>Clear all logs</Text>
      </Button>
    </View>
  );
}
