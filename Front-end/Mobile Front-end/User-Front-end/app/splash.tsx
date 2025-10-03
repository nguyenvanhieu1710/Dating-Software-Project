import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Text, Surface, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <Surface
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop:
            Platform.OS === "ios" ? 44 : (StatusBar.currentHeight || 0) + 24,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Heart Icon */}
        <Surface
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
            elevation: 3,
          }}
        >
          <Ionicons name="heart" size={80} color={theme.colors.primary} />
        </Surface>

        {/* App Title */}
        <Text
          variant="displayMedium"
          style={{
            fontWeight: "bold",
            color: theme.colors.primary,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
            marginBottom: 8,
          }}
        >
          Vibe
        </Text>

        {/* Subtitle */}
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.primary,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
            textAlign: "center",
          }}
        >
          Find your true love
        </Text>
      </Surface>
    </SafeAreaView>
  );
}
