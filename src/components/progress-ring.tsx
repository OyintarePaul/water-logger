import { type ReactNode, useEffect } from "react";
import { View } from "react-native";
import Animated, {
	Easing,
	useAnimatedProps,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
	progress: number; // 0 to 1
	size?: number;
	strokeWidth?: number;
	children?: ReactNode;
};

export function ProgressRing({
	progress,
	size = 160,
	strokeWidth = 12,
	children,
}: ProgressRingProps) {
	const center = size / 2;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const animatedProgress = useSharedValue(0);

	useEffect(() => {
		animatedProgress.value = withTiming(Math.min(Math.max(progress, 0), 1), {
			duration: 800,
			easing: Easing.out(Easing.cubic),
		});
	}, [progress]);

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: circumference * (1 - animatedProgress.value),
	}));

	return (
		<View
			style={{ width: size, height: size }}
			className="items-center justify-center"
		>
			<Svg
				width={size}
				height={size}
				style={{ transform: [{ rotate: "-90deg" }] }}
			>
				<Circle
					cx={center}
					cy={center}
					r={radius}
					stroke="#E3F2FB"
					strokeWidth={strokeWidth}
					fill="none"
				/>
				<AnimatedCircle
					cx={center}
					cy={center}
					r={radius}
					stroke="#1A8FD6"
					strokeWidth={strokeWidth}
					fill="none"
					strokeLinecap="round"
					strokeDasharray={circumference}
					animatedProps={animatedProps}
				/>
			</Svg>
			<View className="absolute inset-0 items-center justify-center">
				{children}
			</View>
		</View>
	);
}
