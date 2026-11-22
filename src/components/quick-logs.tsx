import Ionicons from "@react-native-vector-icons/ionicons";
import { Pressable, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { PRESETS, type Preset } from "@/db/constants";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Text } from "./ui/text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PresetCardProps = Preset & {
	onPress: () => void;
};

function PresetCard({ label, amountMl, onPress }: PresetCardProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<AnimatedPressable
			style={animatedStyle}
			className="basis-[48%] grow"
			unstable_pressDelay={100}
			onPressIn={() => {
				scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
				onPress();
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 15, stiffness: 400 });
			}}
		>
			<Card className="gap-1 py-4">
				<CardHeader className="flex-row items-center justify-between pb-0">
					<CardTitle>{label}</CardTitle>
					<Ionicons name="water" size={18} color="#1A8FD6" />
				</CardHeader>
				<CardContent className="pt-1">
					<Text variant="muted">{amountMl} ml</Text>
				</CardContent>
			</Card>
		</AnimatedPressable>
	);
}

type QuickLogsProps = {
	onPresetPress: (preset: Preset) => void;
};

export function QuickLogs({ onPresetPress }: QuickLogsProps) {
	return (
		<View className="gap-2">
			<View className="flex-row items-center justify-between">
				<Text variant="h4">Quick log</Text>
				<Text variant="muted">Tap to add</Text>
			</View>
			<View className="flex-row flex-wrap gap-3">
				{PRESETS.map((preset) => (
					<PresetCard
						key={preset.label}
						label={preset.label}
						amountMl={preset.amountMl}
						onPress={() => {
							const t = Date.now();
							onPresetPress(preset);
							console.log("log took", Date.now() - t, "ms");
						}}
					/>
				))}
			</View>
		</View>
	);
}
