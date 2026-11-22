import { useRef, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { GoalPage } from "@/components/onboarding/goal-page";
import { RemindersPage } from "@/components/onboarding/reminders-page";
import { WelcomePage } from "@/components/onboarding/welcome-page";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
	completeOnboarding,
	updateSettings,
	useSettings,
} from "@/db/queries/settings";
import { requestReminderPermission } from "@/lib/notifications";

const PAGES = [WelcomePage, GoalPage, RemindersPage];

export default function OnboardingScreen() {
	const { width } = useWindowDimensions();
	const settings = useSettings();
	const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
	const [page, setPage] = useState(0);
	const isLast = page === PAGES.length - 1;

	function goTo(index: number) {
		scrollRef.current?.scrollTo({ x: index * width, animated: true });
		setPage(index);
	}

	async function handleNext() {
		if (!isLast) return goTo(page + 1);

		if (settings.remindersEnabled && !(await requestReminderPermission())) {
			updateSettings({ remindersEnabled: false });
		}
		completeOnboarding();
	}

	return (
		<View className="flex-1 bg-background">
			<ScrollView
				ref={scrollRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={(e) =>
					setPage(Math.round(e.nativeEvent.contentOffset.x / width))
				}
				className="flex-1"
			>
				{PAGES.map((Page, i) => (
					<View key={i} style={{ width }} className="flex-1 justify-center p-6">
						<Page />
					</View>
				))}
			</ScrollView>

			<View className="gap-6 p-6">
				<View className="flex-row justify-center gap-2">
					{PAGES.map((_, i) => (
						<View
							key={i}
							className={`size-2 rounded-full ${i === page ? "bg-primary" : "bg-border"}`}
						/>
					))}
				</View>

				<Button onPress={handleNext}>
					<Text>{isLast ? "Get started" : "Next"}</Text>
				</Button>
			</View>
		</View>
	);
}
