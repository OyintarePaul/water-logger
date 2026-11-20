import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
	return (
		<View className="flex-1">
			<Button>
				<Text>Hello World</Text>
			</Button>
		</View>
	);
}
