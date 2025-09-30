import {
  DarkTheme as NavigationDark,
  DefaultTheme as NavigationDefault,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Provider as PaperProvider,
  MD3LightTheme as PaperLight,
  MD3DarkTheme as PaperDark,
} from "react-native-paper";
import { myLightTheme, myDarkTheme } from "@/theme/paperTheme";

// Function merge theme between Paper & React Navigation
function mergeThemes(paperTheme: any, navTheme: any) {
  return {
    ...paperTheme,
    colors: {
      ...paperTheme.colors,
      ...navTheme.colors,
    },
  };
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const paperTheme = colorScheme === "dark" ? myDarkTheme : myLightTheme;
  const navTheme = colorScheme === "dark" ? NavigationDark : NavigationDefault;

  const combinedTheme = mergeThemes(paperTheme, navTheme);

  return (
    <PaperProvider theme={combinedTheme}>
      <NavigationThemeProvider value={combinedTheme}>
        <Stack initialRouteName="splash">
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile-detail"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="match" options={{ headerShown: false }} />
          <Stack.Screen name="chat" options={{ headerShown: false }} />
          <Stack.Screen name="friends" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen
            name="explore-detail"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="safety-center" options={{ headerShown: false }} />
          <Stack.Screen name="subscriptions" options={{ headerShown: false }} />
          <Stack.Screen name="consumable" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </PaperProvider>
  );
}
