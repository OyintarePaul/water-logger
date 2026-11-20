import { View } from 'react-native';
import { Text } from './ui/text';

type HeaderTitleProps = {
  subtitle: string;
  title: string;
};

export function HeaderTitle({ subtitle, title }: HeaderTitleProps) {
  return (
    <View>
      <Text variant="muted">{subtitle}</Text>
      <Text variant="h3">{title}</Text>
    </View>
  );
}
