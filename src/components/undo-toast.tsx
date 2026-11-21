import { useEffect, useRef } from "react";
import { Pressable } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Text } from "./ui/text";

const SHOW_MS = 4000;
const ENTER_MS = 200;
const EXIT_MS = 150;

type UndoToastProps = {
	label: string;
	amountMl: number;
	onUndo: () => void;
	onDismiss: () => void;
};

export function UndoToast({
	label,
	amountMl,
	onUndo,
	onDismiss,
}: UndoToastProps) {
	// 0 = hidden, 1 = shown
	const progress = useSharedValue(0);
	const closing = useRef(false);

	// Runs the exit animation once, then calls the callback
	function close(callback: () => void) {
		if (closing.current) return;
		closing.current = true;
		progress.value = withTiming(
			0,
			{ duration: EXIT_MS, easing: Easing.in(Easing.cubic) },
			(finished) => {
				if (finished) runOnJS(callback)();
			},
		);
	}

	useEffect(() => {
		progress.value = withTiming(1, {
			duration: ENTER_MS,
			easing: Easing.out(Easing.cubic),
		});
		const timer = setTimeout(() => close(onDismiss), SHOW_MS);
		return () => clearTimeout(timer);
		// The parent gives each entry its own key, so this runs once per toast
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: progress.value,
		transform: [{ translateY: (1 - progress.value) * 24 }],
	}));

	return (
		<Animated.View
			style={[animatedStyle, { elevation: 6 }]}
			className="absolute inset-x-4 bottom-4 flex-row items-center justify-between rounded-md bg-foreground py-3 pl-4 pr-2"
		>
			<Text className="flex-1 text-background" numberOfLines={1}>
				{label} · {amountMl} ml logged
			</Text>
			<Pressable
				onPress={() => close(onUndo)}
				hitSlop={8}
				className="rounded-sm px-3 py-2 active:opacity-70"
			>
				<Text className="font-semibold uppercase tracking-wide text-progress">
					Undo
				</Text>
			</Pressable>
		</Animated.View>
	);
}
