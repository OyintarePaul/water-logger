import { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
	useAnimatedProps,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { colors, spacing } from "@/lib/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_STROKE = 14;
const RING_MAX_RADIUS = 90;
const CARD_PADDING = spacing.lg;

type Props = {
	count: number;
	goal: number;
	children?: React.ReactNode;
};

export default function ProgressRing({ count, goal, children }: Props) {
	const { width: screenWidth } = useWindowDimensions();
	const availableWidth = screenWidth - spacing.lg * 2 - CARD_PADDING * 2 - 2;
	const radius = Math.min(
		RING_MAX_RADIUS,
		Math.floor((availableWidth - RING_STROKE) / 2),
	);

	const size = radius * 2 + RING_STROKE;
	const center = size / 2;
	const circumference = 2 * Math.PI * radius;

	const progress = useSharedValue(0);

	useEffect(() => {
		const fraction = goal > 0 ? Math.min(count / goal, 1) : 0;
		progress.value = withTiming(fraction, { duration: 400 });
	}, [count, goal]);

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: circumference * (1 - progress.value),
	}));

	return (
		<View style={{ width: size, height: size }}>
			{/* Circles are rotated individually around their centre so the arc starts at the top */}
			<Svg width={size} height={size} style={StyleSheet.absoluteFill}>
				<Circle
					cx={center}
					cy={center}
					r={radius}
					stroke="#E0EEF5"
					strokeWidth={RING_STROKE}
					fill="none"
					rotation={-90}
					origin={`${center}, ${center}`}
				/>
				<AnimatedCircle
					cx={center}
					cy={center}
					r={radius}
					stroke={colors.primary}
					strokeWidth={RING_STROKE}
					fill="none"
					strokeDasharray={[circumference, circumference]}
					animatedProps={animatedProps}
					rotation={-90}
					origin={`${center}, ${center}`}
				/>
			</Svg>
			<View
				style={[StyleSheet.absoluteFill, styles.overlay]}
				pointerEvents="none"
			>
				{children}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		alignItems: "center",
		justifyContent: "center",
	},
});
