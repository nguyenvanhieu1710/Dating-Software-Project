// src/theme/paperTheme.ts
import {
    MD3LightTheme as DefaultLight,
    MD3DarkTheme as DefaultDark,
  } from "react-native-paper";
  
  // Theme Light
  export const myLightTheme = {
    ...DefaultLight,
    colors: {
      ...DefaultLight.colors,
      primary: "#8b5cf6",
      secondary: "#06b6d4",
      tertiary: "#f59e0b",
      background: "#FFFFFF",
      surface: "#F8F9FA",
      text: "#000000",
      ripple: "#000000",
      success: "#10B981",
      error: "#EF4444",
    },
    fonts: {
      ...DefaultLight.fonts,
      bodyLarge: {
        ...DefaultLight.fonts.bodyLarge,
        fontFamily: "SpaceMono",
      },
      titleLarge: {
        ...DefaultLight.fonts.titleLarge,
        fontFamily: "SpaceMono",
      },
    },
  };
  
  // Theme Dark
  export const myDarkTheme = {
    ...DefaultDark,
    colors: {
      ...DefaultDark.colors,
      primary: "#8b5cf6",
      secondary: "#06b6d4",
      tertiary: "#f59e0b",
      background: "#121212",
      surface: "#1E1E1E",
      text: "#FFFFFF",
      ripple: "#FFFFFF",
      success: "#10B981",
      error: "#EF4444",
    },
    fonts: {
      ...DefaultDark.fonts,
      bodyLarge: {
        ...DefaultDark.fonts.bodyLarge,
        fontFamily: "SpaceMono",
      },
      bodyMedium: {
        ...DefaultDark.fonts.bodyMedium,
        fontFamily: "SpaceMono",
      },
      bodySmall: {
        ...DefaultDark.fonts.bodySmall,
        fontFamily: "SpaceMono",
      },
      titleLarge: {
        ...DefaultDark.fonts.titleLarge,
        fontFamily: "SpaceMono",
      },
    },
  };
  