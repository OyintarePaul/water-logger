import { View } from "react-native";
import { Text } from "./ui/text";

type HeaderTitleProps = {
	subtitle: string;
	title: string;
	subtitlePosition?: "top" | "bottom";
};

export function HeaderTitle({
	subtitle,
	title,
	subtitlePosition = "top",
}: HeaderTitleProps) {
	const subtitleEl = <Text variant="muted">{subtitle}</Text>;
	const titleEl = <Text variant="h3">{title}</Text>;

	return (
		<View>
			{subtitlePosition === "top" ? (
				<>
					{subtitleEl}
					{titleEl}
				</>
			) : (
				<>
					{titleEl}
					{subtitleEl}
				</>
			)}
		</View>
	);
}
