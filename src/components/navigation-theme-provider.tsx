import { ThemeProvider } from "expo-router";
import { useEffect, type PropsWithChildren } from "react";
import { useUniwind } from "uniwind";
import { darkTheme, lightTheme } from "@/lib/theme";
import { setBackgroundColorAsync } from "expo-system-ui";

export function NavigationThemeProvider({ children }: PropsWithChildren) {
	const { theme } = useUniwind();
    const navTheme = theme === "dark" ? darkTheme : lightTheme;

    useEffect(() => {
        setBackgroundColorAsync(navTheme.colors.background);
    }, [navTheme]);

	return (
		<ThemeProvider value={navTheme}>
			{children}
		</ThemeProvider>
	);
}
