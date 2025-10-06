import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Provider as PaperProvider,
} from "react-native-paper";
import { myLightTheme, myDarkTheme } from "@/theme/paperTheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const paperTheme = colorScheme === "dark" ? myDarkTheme : myLightTheme;
  
  return (
    <PaperProvider theme={paperTheme}>
        <Stack>
          <Stack.Screen name="(drawers)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
    </PaperProvider>
  );
}
