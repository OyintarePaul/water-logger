import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Uniwind() {
    const { top } = useSafeAreaInsets()
    return (
        <View style={{ paddingTop: top }} className="relative flex-1">
            <View className="absolute bottom-6 w-full flex align-center px-15">
            <Pressable
                className="bg-blue-500 px-6 py-3 rounded-full active:opacity-80 focus:ring-2 focus:ring-blue-300"
                onPress={() => console.log('Pressed')}
            >
                <Text className="text-white text-center font-semibold">Press me</Text>
            </Pressable>
            </View>
        </View>
    )
}