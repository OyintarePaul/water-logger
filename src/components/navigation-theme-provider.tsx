import { ThemeProvider } from "expo-router";
import type { PropsWithChildren } from "react";
import { useUniwind } from "uniwind";
import { darkTheme, lightTheme } from "@/lib/theme";

export function NavigationThemeProvider({ children }: PropsWithChildren) {
	const { theme } = useUniwind();
	console.log(theme);

	return (
		<ThemeProvider value={theme === "dark" ? darkTheme : lightTheme}>
			{children}
		</ThemeProvider>
	);
}
