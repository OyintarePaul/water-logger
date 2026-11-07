import { StyleSheet, View, Text } from "react-native";
import ProgressRing from "./progress-ring"
import { colors, spacing, fonts } from "@/lib/theme"
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated"
import { getMotivation } from "@/lib/motivation";

interface Props {
    todayCount: number,
    dailyGoal: number
    scale: SharedValue<number>
}

export default function Progress({ todayCount, dailyGoal, scale }: Props) {
    	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

    return (
        <View style={styles.card}>
				<ProgressRing count={todayCount} goal={dailyGoal}>
					<Animated.Text style={[styles.count, animatedStyle]}>
						{todayCount}
					</Animated.Text>
					<Text style={styles.goal}>/ {dailyGoal} glasses</Text>
				</ProgressRing>
				<Text style={styles.motivation}>{getMotivation(dailyGoal, dailyGoal)}</Text>
			</View>
    )
}

const styles = StyleSheet.create({
    card: {
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: spacing.lg,
            alignItems: "center",
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: "#E0EEF5",
        },

        count: {
                fontFamily: fonts.bold,
                fontSize: 64,
                lineHeight: 72,
                color: colors.primary,
                textAlign: "center",
                includeFontPadding: false,
            },
            goal: {
                fontFamily: fonts.regular,
                fontSize: 16,
                color: colors.muted,
                marginTop: spacing.sm,
                textAlign: "center",
            },
            motivation: {
                fontFamily: fonts.regular,
                fontSize: 15,
                color: colors.muted,
                marginTop: spacing.md,
                textAlign: "center",
            },
})